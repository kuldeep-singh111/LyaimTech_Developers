const dotenv = require('dotenv');
const User = require("../models/user"); 
// dotenv.config(); 

const updateUserProfile = async (req, res) => {
    const userId = req.id; 
    const { email, username, mobile_no } = req.body;

    try {
     
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { email, username, mobile_no },
            { new: true, runValidators: true }
        ).select('email username mobileNo');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Profile updated successfully. Please log in again.', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};




module.exports = {updateUserProfile};
