const User = require("../models/user");

const userProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select('email username mobileNo referralCode');

        if (!user) return res.status(404).json({ message: 'User not found' });//console.log(user);

        const adminUsers = ["67b42373ec0b5dc8a639ef91", "67b41ccb88e950464ab6bd83", "67b431dad976d17271d87935"]; // List of admin user IDs

        // Referral Count Logic
        const referralCount = await User.countDocuments({ referralCode: user.username }).lean();


        // Manually add the role before sending the response
        const userWithRole = {
            ...user.toObject(), // Convert Mongoose document to plain object
            role: adminUsers.includes(userId) ? "admin" : "user", // Assign role dynamically
            referralCount   // Add referral count
        };

        res.json(userWithRole);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching profile.' });
    }
};

const getAllUser = async (_, res) => {
    try {
        const allUsers = await User.find().select("username email mobileNo referralCode wallet.depositAmount -_id");
        res.status(200).json({ users: allUsers })
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching all users.' });
    }
}

const Contest = require('../models/Contest'); // If user is linked to contests
const Team = require('../models/Team'); // If user has teams
// const Wallet = require('../models/Wallet'); // If user has a wallet

const deleteUser = async (req, res) => {
    try {
        const { username } = req.params;

        // Check if user exists
        const user = await User.findOne({username});
        // console.log(user);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userId = user._id;

        // Delete related documents (assuming references exist)
        await Contest.updateMany(
            { "players.userId": userId }, // Find contests where user is a player
            { $pull: { players: { userId } } } // Remove user from 'players' array
        );

        await Team.deleteMany({ userId }); // Delete teams created by the user

        // await Wallet.deleteOne({ userId }); // Delete the user's wallet (if exists)

        // Finally, delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ success: true, message: "User and related data deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { userProfile, getAllUser, deleteUser };
