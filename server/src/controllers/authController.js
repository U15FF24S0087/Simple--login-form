import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && emailPattern.test(email);
}

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  };
}

export async function register(request, response, next) {
  const { name, email, password } = request.body ?? {};

  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) {
    return response.status(400).json({
      message: 'Name is required and must be no longer than 80 characters.'
    });
  }

  if (typeof email !== 'string' || !isValidEmail(email.trim())) {
    return response.status(400).json({ message: 'Enter a valid email address.' });
  }

  if (
    typeof password !== 'string' ||
    password.length < 8 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return response.status(400).json({
      message: 'Password must be at least 8 characters and no longer than 72 UTF-8 bytes.'
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return response.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    return response.status(201).json({
      message: 'Account created successfully. You can now log in.',
      user: publicUser(user)
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        message: 'An account with this email already exists.'
      });
    }
    return next(error);
  }
}

export async function login(request, response, next) {
  const { email, password } = request.body ?? {};

  if (typeof email !== 'string' || !isValidEmail(email.trim())) {
    return response.status(400).json({ message: 'Enter a valid email address.' });
  }

  if (
    typeof password !== 'string' ||
    password.length === 0 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return response.status(400).json({ message: 'Enter your password.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      '+password'
    );
    const passwordMatches =
      user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return response.status(401).json({ message: 'Email or password is incorrect.' });
    }

    return response.json({
      message: 'Logged in successfully.',
      token: createToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(request, response, next) {
  try {
    const user = await User.findById(request.userId);

    if (!user) {
      return response.status(401).json({ message: 'Your account could not be found.' });
    }

    return response.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}
