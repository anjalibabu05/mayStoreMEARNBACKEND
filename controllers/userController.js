const jwt = require('jsonwebtoken');
const users = require('../model/usermodel');



// REGISTER
exports.registerController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log(username, email, password);
    res.status(200).json('Request received');
  } catch (err) {
    res.status(500).json({ message: 'Error in registration', error: err.message });
  }
};

// LOGIN
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) return res.status(404).json('Incorrect email id');
    if (existingUser.password !== password) return res.status(401).json('Incorrect password');

    const token = jwt.sign({ userMail: existingUser.email }, 'secretKey', { expiresIn: '1h' });
    console.log('✅ Generated token:', token);

    res.status(200).json({ existingUser, token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// GOOGLE LOGIN
exports.googleLoginController = async (req, res) => {
  const { username, email, password, photo } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      const token = jwt.sign({ userMail: existingUser.email }, 'secretKey');
      res.status(200).json({ existingUser, token });
    } else {
      const newUser = new users({ username, email, password, profile: photo });
      await newUser.save();
      const token = jwt.sign({ userMail: newUser.email }, 'secretKey');
      res.status(200).json({ existingUser: newUser, token });
    }
  } catch (err) {
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
};

// ADMIN - Get All Users
exports.getAlluserController = async (req, res) => {
  const email = req.payload;
  try {
    const allUsers = await users.find({ email: { $ne: email } });
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// update profile

exports.editAdminProfileController = async (req, res) => {
  const { username, password, profile } = req.body;
  const prof = req.file ? req.file.filename : profile;

  try {
    // ✅ Extract token manually
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secretKey');
    const email = decoded.userMail;

    // ✅ Update admin profile
    const adminDetails = await users.findOneAndUpdate(
      { email },
      { username, email, password, profile: prof },
      { new: true }
    );

    if (!adminDetails) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await adminDetails.save();
    res.status(200).json(adminDetails);
  } catch (err) {
    console.error('Error updating admin profile:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Edit User Profile
exports.editUserProfileController = async (req, res) => {
  try {
    const { username, password, bio } = req.body;
    const profileImage = req.file ? req.file.filename : undefined;

    // ✅ Get token
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secretKey");
    const email = decoded.userMail;

    // ✅ Build update object dynamically
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    if (bio) updateData.bio = bio;
    if (profileImage) updateData.profile = profileImage;

    // ✅ Update user document
    const updatedUser = await users.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  }catch (err) {
  console.error("Error updating user profile:", err);
  return res.status(500).json({
    message: "Server error while updating user profile",
    error: err.message,
  });
}
};


