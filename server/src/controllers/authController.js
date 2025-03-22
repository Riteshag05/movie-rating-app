const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Create and send JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Register new user
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Create admin (for development purposes)
exports.createAdmin = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        status: 'fail',
        message: 'This route is only available in development mode'
      });
    }

    const { name, email, password } = req.body;

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    createSendToken(admin, 201, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
}; 