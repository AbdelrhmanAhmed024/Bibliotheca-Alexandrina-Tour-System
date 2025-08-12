const bcrypt = require('bcrypt');
const User = require('./../../models/userModel');
const AppError = require('./../utils/AppError');
const { formatEgyptianPhoneNumber } = require('./../utils/phone');


const ROLE_MODELS = Object.freeze({
    visitor: Visitor,
    leadGuide: LeadGuide,
    guide: Guide,
    admin: Admin,
});

const ROLE_REQUIRED_FIELDS = Object.freeze({
    visitor: ['phoneNumber'],
});

const MIN_PASSWORD_LENGTH = parseInt(process.env.MIN_PASSWORD_LENGTH || '8', 10);

function normalizeGender(gender) {
    if (!gender) return 'not determined';
    const g = gender.toString().trim().toLowerCase();
    if (['male', 'm'].includes(g)) return 'male';
    if (['female', 'f'].includes(g)) return 'female';
    return 'not determined';
}

function normalizeEmail(email) {
    if (!email) return email;
    return email.trim().toLowerCase();
}

function normalizePhone(phone) {
    if (!phone) return phone;
    return formatEgyptianPhoneNumber(phone);
}

async function ensureUniqueEmail(email) {
    const duplicate = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (duplicate) throw new AppError('This E-Mail is already associated with a user.', 400);
}

async function ensureUniquePhone(phone) {
    if (!phone) return;
    const duplicate = await User.findOne({ phoneNumber: phone });
    if (duplicate) throw new AppError('This phone number is already associated with a user.', 400);
}

function validateCommon(payload) {
    const { role, firstName, lastName, email, password, confirmPassword } = payload;
    if (!role) throw new AppError('Role is required', 400);
    if (!ROLE_MODELS[role.toLowerCase()]) throw new AppError('Invalid role', 400);
    if (!firstName) throw new AppError('Please enter your first name.', 400);
    if (!lastName) throw new AppError('please enter your second name.', 400)
    if (!email) throw new AppError('Email is required', 400);
    if (!password || !confirmPassword) throw new AppError('Password & confirmPassword required', 400);
    if (password !== confirmPassword) throw new AppError('Passwords do not match', 400);
    if (password.length < MIN_PASSWORD_LENGTH) throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`, 400);
}

function validateRoleSpecific(roleKey, payload) {
    const required = ROLE_REQUIRED_FIELDS[roleKey] || [];
    for (const field of required) {
        if (!payload[field]) throw new AppError(`${field} is required for role ${roleKey}`, 400);
    }
}

async function hashPassword(raw) {
    return bcrypt.hash(raw, 12);
}

function buildUserDoc({ firstName, lastName, email, password, gender, phoneNumber, extra }) {
    const doc = {
        firstName,
        lastName,
        email,
        password,
        gender: normalizeGender(gender),
        email,
        ...extra
    };
    if (phoneNumber) doc.phoneNumber = phoneNumber;
    return doc;
}

function getRoleModel(roleKey) {
    return ROLE_MODELS[roleKey];
}

module.exports = {
    normalizeGender,
    normalizeEmail,
    normalizePhone,
    ensureUniqueEmail,
    ensureUniquePhone,
    validateCommon,
    validateRoleSpecific,
    hashPassword,
    buildUserDoc,
    getRoleModel,
    ROLE_MODELS,
    ROLE_REQUIRED_FIELDS
};
