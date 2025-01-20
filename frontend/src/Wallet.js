import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import dotenv from 'dotenv';
import paypal from '@paypal/checkout-server-sdk';

dotenv.config();
const router = Router();

// PayPal SDK Environment Configuration
const environment = new paypal.core.LiveEnvironment( // Change to LiveEnvironment
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Middleware: Authenticate using JWT
const authenticateToken = (req, res, next) => {
    const token = req.cookies['auth_token'];
    if (!token) return res.status(401).json({ message: 'Access denied. Please log in.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id;
        next();
    } catch (error) {
        console.error('JWT validation error:', error);
        return res.status(403).json({ message: 'Invalid token. Please log in again.' });
    }
};

// GET: Fetch Wallet Data
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.id;

    try {
        const [result] = await db.query(
            `SELECT depositamount, cashbonus, winningamount, withdrawableamount, totalmoney 
             FROM wallets 
             WHERE id = ?`,
            [userId]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Wallet not found.' });
        }

        const wallet = result[0];
        res.json({
            depositAmount: wallet.depositamount,
            cashBonus: wallet.cashbonus,
            winningAmount: wallet.winningamount,
            withdrawableAmount: wallet.withdrawableamount,
            totalMoney: wallet.totalmoney,
        });
    } catch (error) {
        console.error('Error fetching wallet data:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// POST: Create PayPal Order for Adding Funds
router.post('/add-funds', authenticateToken, async (req, res) => {
    console.log('POST /add-funds hit');
    const { amount } = req.body;
    const userId = req.id;

    if (amount < 10) {
        return res.status(400).json({ message: 'Minimum deposit amount is $10.' });
    }

    try {
        const order = new paypal.orders.OrdersCreateRequest();
        order.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: amount.toFixed(2),
                    },
                },
            ],
            application_context: {
                return_url: `http://localhost:3000/html/wallet.html?status=success`, // Success URL
                cancel_url: `http://localhost:3000/html/wallet.html?status=cancel`,  // Cancel URL
                user_action: 'PAY_NOW', // Directly prompts the user to approve the payment
            },
        });

        const response = await client.execute(order);
        const approvalUrl = response.result.links.find((link) => link.rel === 'approve').href;

        res.status(200).json({ approvalUrl });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        if (error.response) {
            console.error('PayPal error response:', error.response);
        }
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Handle PayPal Payment Success
router.get('/add-funds/success', authenticateToken, async (req, res) => {
    console.log('Redirecting to success page...');
    const userId = req.id;
    const { token, PayerID } = req.query;

    if (!token || !PayerID) {
        return res.status(400).json({ message: 'Invalid payment data.' });
    }

    try {
        const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
        captureRequest.requestBody({});
        const captureResponse = await client.execute(captureRequest);

        // Update wallet balance in the database
        const amount = parseFloat(captureResponse.result.purchase_units[0].payments.captures[0].amount.value);
        await db.query(
            `UPDATE wallets 
             SET depositamount = depositamount + ?, totalmoney = totalmoney + ? 
             WHERE id = ?`,
            [amount, amount, userId]
        );

        res.json({ message: 'Payment successful, funds added!' });
    } catch (error) {
        console.error('Error completing PayPal payment:', error);
        res.status(500).json({ message: 'Error processing payment. Please try again.' });
    }
});

router.post('/withdraw', authenticateToken, async (req, res) => {
    const { amount, paypalId, age } = req.body; // Accepting PayPal ID and age from the user
    const userId = req.id;

    // Validation for withdrawal amount
    if (amount < 50) {
        return res.status(400).json({ message: 'Minimum withdrawal amount is $50.' });
    }
    if (amount > 10000) {
        return res.status(400).json({ message: 'Maximum withdrawal amount is $10,000.' });
    }

    // Validate additional fields
    if (!paypalId || !age) {
        return res.status(400).json({ message: 'PayPal ID and age are required for withdrawal.' });
    }

    try {
        // Check user wallet balance
        const [wallet] = await db.query(`SELECT * FROM wallets WHERE id = ?`, [userId]);
        if (wallet.length === 0) {
            return res.status(404).json({ message: 'Wallet not found.' });
        }

        const { withdrawableamount, winningamount, totalmoney } = wallet[0];
        if (withdrawableamount < amount || winningamount < amount) {
            return res.status(400).json({ message: 'Insufficient funds for withdrawal.' });
        }

        // Insert withdrawal request details into `request_money` table
        const dateRequested = new Date();
        await db.query(
            `INSERT INTO request_money (user_id, requested_amount, paypal_id, age, date_requested) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, amount, paypalId, age, dateRequested]
        );

        // Deduct the withdrawal amount from the wallet
        await db.query(
            `UPDATE wallets 
             SET withdrawableamount = withdrawableamount - ?, winningamount = winningamount - ?, totalmoney = totalmoney - ?
               WHERE id = ?`,
            [amount, amount, amount, userId]
        );

        // Respond with a success message
        res.json({
            message: 'Withdrawal request submitted successfully! You will receive your money within 6 hours.',
        });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        res.status(500).json({ message: 'Error processing withdrawal. Please try again.' });
    }
});
export default router;