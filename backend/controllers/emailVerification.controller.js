const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

if (!process.env.RESEND_API) {
    console.log("Provide RESEND_API in side the .env file")
}

const resend = new Resend(process.env.RESEND_API);

let otpStore = {}; // Temporary store

const sendOtpForEmailVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "email is required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = otp;

        await sendEmail({
            sendTo: email,
            subject: "Verify email from Lyaim Tech",
            html: verifyEmailTemplate({
                otp
            })
        })

        res.status(200).json({
            message: "OTP sent successfully",
            error: false,
            success: true,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending OTP", error });
    }
}

const verifyOtpForEmail = async (req, res) => {
    console.log('otpStore', otpStore)
    const { email, otp } = req.body;
console.log(req.body)
    if (!email || !otp) {
        return res.status(400).json({ message: "email and otp are required." });
    }

    if (!otpStore[email] || otpStore[email] !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, delete from store
    delete otpStore[email];

    res.status(200).json({
        message: "email verified successfully",
        success: true,
    })
}

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Lyaim Tech <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }
        return data
    } catch (error) {
        console.log(error)
    }
}

const verifyEmailTemplate = ({ otp }) => {
    return `
    <h2>Welcome to Lyaim Tech!</h2>

<p>Please verify your email using the One-Time Password (OTP) below:</p>

<div style="font-size: 24px; font-weight: bold; text-align: center; color: #333; background: #f8f8f8; margin: 10px 0; padding: 5px; border-radius: 5px">${otp}</div>

<p>This code is valid for only <strong>10 minutes</strong> and can only be used once.</p>

<p>If you did not request this, please ignore this email.</p>

<div style="font-size: 14px; color: #777; margin-top: 20px;">
    <p>Need help? Contact our support team at <a href="mailto:support@lyaim.com">support@lyaim.com</a></p>
    <p>Best regards, <br><strong>Lyaim Tech</strong></p>
    <p><a href="https://www.lyaim.com/">Visit our website</a></p>
</div>
`
}

module.exports = { sendOtpForEmailVerification, verifyOtpForEmail };