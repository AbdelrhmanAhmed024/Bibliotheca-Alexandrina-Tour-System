const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/userModel');
const Visitor = require('../../models/visitorModel');
const Guide = require('../../models/guideModel');
const Admin = require('../../models/adminModel');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Create and send token with response
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Set JWT as a cookie
    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // Cookie cannot be accessed or modified in any way by the browser
        secure: process.env.NODE_ENV === 'production' // Cookie will only be sent on HTTPS
    };

    res.cookie('jwt', token, cookieOptions);

    return res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        }
    });
};

class AuthController {
    signupVisitor = async (req, res, next) => {
        try {

            // Extract fields from form data or JSON
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;
            const password = req.body.password;
            const dateOfBirth = req.body.dateOfBirth;
            const nationality = req.body.nationality;

            // Debug log each field
            console.log('Received fields:', {
                firstName: firstName || 'missing',
                lastName: lastName || 'missing',
                email: email || 'missing',
                password: password ? 'provided' : 'missing',
                dateOfBirth: dateOfBirth || 'missing',
                nationality: nationality || 'missing'
            });

            // Validate required fields
            if (!firstName || !lastName || !email || !password || !dateOfBirth || !nationality) {
                const missingFields = [];
                if (!firstName) missingFields.push('firstName');
                if (!lastName) missingFields.push('lastName');
                if (!email) missingFields.push('email');
                if (!password) missingFields.push('password');
                if (!dateOfBirth) missingFields.push('dateOfBirth');
                if (!nationality) missingFields.push('nationality');

                throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
            }

            // Validate password
            if (password.length < 8) {
                throw new AppError('Password must be at least 8 characters long', 400);
            }

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new AppError('Email already in use', 400);
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new AppError('Please provide a valid email address', 400);
            }

            // Validate date format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(dateOfBirth)) {
                throw new AppError('Date of birth must be in YYYY-MM-DD format', 400);
            }

            // Create new visitor
            const newVisitor = await Visitor.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                dateOfBirth,
                nationality
            });

            // Generate token
            const token = signToken(newVisitor._id);

            res.status(201).json({
                status: 'success',
                token,
                message: 'Visitor registered successfully with Email ' + email
            });
        } catch (error) {
            next(error);
        }
    }

    signupGuide = async (req, res, next) => {
        try {
            const {
                firstName,
                lastName,
                email,
                password,
                dateOfBirth,
                yearsOfExperience,
                languages,
                specialization
            } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new AppError('Email already in use', 400);
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create new guide
            const newGuide = await Guide.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                dateOfBirth,
                yearsOfExperience,
                languages,
                specialization
            });

            // Generate token
            const token = signToken(newGuide._id);

            res.status(201).json({
                status: 'success',
                token,
                message: 'Guide registered successfully with Email ' + email
            });
        } catch (error) {
            next(error);
        }
    }

    signupAdmin = async (req, res, next) => {
        try {
            const { firstName, lastName, email, password, dateOfBirth } = req.body;

            // Check if request includes admin secret key
            const adminSecretKey = req.headers['admin-secret-key'];
            if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
                throw new AppError('Unauthorized to create admin account', 403);
            }

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new AppError('Email already in use', 400);
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create new admin
            const newAdmin = await Admin.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                dateOfBirth
            });

            // Send response with token
            createSendToken(newAdmin, 201, res);
        } catch (error) {
            next(error);
        }
    }

    logout = async (req, res, next) => {
        try {
            // Clear the JWT cookie
            res.cookie('jwt', 'loggedout', {
                expires: new Date(Date.now() + 1 * 1000),
                httpOnly: true
            });

            res.status(200).json({
                status: 'success',
                message: 'Successfully logged out'
            });
        } catch (error) {
            next(error);
        }
    }

    changePassword = async (req, res, next) => {
        try {
            const { currentPassword, newPassword, confirmNewPassword } = req.body;

            // Check if all required fields are provided
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                throw new AppError('Please provide current password and new password', 400);
            }

            // Check if new password and confirm password match
            if (newPassword !== confirmNewPassword) {
                throw new AppError('New passwords do not match', 400);
            }

            // Get user from collection
            const user = await User.findById(req.user.id);

            // Check if current password is correct
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                throw new AppError('Current password is incorrect', 401);
            }

            // Validate new password
            if (newPassword.length < 8) {
                throw new AppError('New password must be at least 8 characters long', 400);
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            // Update password
            user.password = hashedPassword;
            await user.save();

            // Log user in with new password
            createSendToken(user, 200, res);
        } catch (error) {
            next(error);
        }
    }

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Check if email and password exist
            if (!email || !password) {
                throw new AppError('Please provide email and password', 400);
            }

            // Find user and include password
            const user = await User.findOne({ email }).select('+password');
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new AppError('Incorrect email or password', 401);
            }

            // Generate token
            const token = signToken(user._id);

            res.status(200).json({
                status: 'success',
                token,
                message: 'Login successful, welcome back ' + user.firstName
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
