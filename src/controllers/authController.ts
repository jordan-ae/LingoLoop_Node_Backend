import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/emailService';
import { RolesEnum } from '../enums';
import { validateLoginRequest, validateRegisterRequest, resendEmailVerificationRequest } from '../validators/authValidators';
import { createResponse } from '../utils/createResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async (req: Request, res: Response) => {
  await Promise.all(validateRegisterRequest.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return createResponse(res, false, 400, errors.array()[0].msg);
  }

  const { name, email, password, role } = req.body;

  // check to ensure user with email does not already exist
  const user = await User.findOne({ email });
  if (user) {
    return createResponse(res, false, 401, 'User with provided email already exists')
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationToken,
      isActive: false
    });

    await user.save();

    // await sendVerificationEmail(email, verificationToken);

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return createResponse(res, true, 201, 'User registered - Please check your email to verify your account', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified
      },
      token
    });
  } catch (err) {
    return createResponse(res, false, 500, 'Registration failed', err);
  }
};

export const login = async (req: Request, res: Response) => {
  await Promise.all(validateLoginRequest.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return createResponse(res, false, 400, errors.array()[0].msg);
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return createResponse(res, false, 400, 'Invalid email or password');
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return createResponse(res, true, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    return createResponse(res, false, 500, 'Login failed', err);
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  await Promise.all(resendEmailVerificationRequest.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return createResponse(res, false, 400, errors.array()[0].msg);
  }
  
  const { email } = req.body;
  try {
    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return createResponse(res, false, 401, 'User not found or already verified')
    }
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();
    await sendVerificationEmail(email, verificationToken);
    return createResponse(res, true, 200, 'Verification email sent')
  } catch (err) {
    return createResponse(res, false, 500, 'Failed to resend verification email', err)
  }
}


export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return createResponse(res, false, 400, 'Invalid verification token')
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return createResponse(res, true, 200, 'email verified successfully')
  } catch (err) {
    return createResponse(res, false, 500, 'Email verification failed', err)
  }
};