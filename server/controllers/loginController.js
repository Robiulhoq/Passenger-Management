const Login = require('../models/Login');

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
   
    

    if (!userName || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const user = await Login.findOne({ userName });
    
    

    if (!user) {
      return res.status(401).json({
        message: 'Invalid username or password',
      });
    }

    // Simple password comparison (in production, use bcrypt)
    // Handle both 'password' and 'Password' field names, and convert to string for comparison
    const dbPassword = String(user.password || user.password);
    if (dbPassword !== String(password)) {
      return res.status(401).json({
        message: 'Invalid username or password',
      });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        userName: user.userName,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};

// Get all login records (for admin/testing)
exports.getAllLogins = async (req, res) => {
  try {
    const logins = await Login.find();
    res.status(200).json(logins);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};

// Create a new login record
exports.createLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const existingUser = await Login.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        message: 'Username already exists',
      });
    }

    const login = new Login({
      userName,
      password,
    });

    const savedLogin = await login.save();
    res.status(201).json({
      message: 'Login record created successfully',
      data: savedLogin,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};
