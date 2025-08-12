const bcrypt = require('bcrypt');
// Use v2 models
const User = require('../../../v2/models/User');

// Legacy refresh logic removed in favor of v2 token service (rotation + hashed storage)
const AppError = require('./../utils/AppError');
const { formatEgyptianPhoneNumber } = require('./../utils/phone');

// Registration helpers (single-responsibility utilities)
const {
    normalizeEmail,
    normalizePhone,
    ensureUniqueEmail,
    ensureUniquePhone,
    validateCommon,
    validateRoleSpecific,
    hashPassword,
    buildUserDoc,
    getRoleModel
} = require('./register.helpers');

class AuthService {

    async refresh(accessTokenHeader) {
        if (!accessTokenHeader) throw new AppError('Access token required', 401);
        throw new AppError('Use legacy refresh endpoint for now', 501);
    }


    async register(payload, file) {

        validateCommon(payload);
        const roleKey = payload.role.toLowerCase();
        validateRoleSpecific(roleKey, payload);

        const email = normalizeEmail(payload.email);
        const phone = normalizePhone(payload.phoneNumber);

        await ensureUniqueEmail(email);
        if (phone) await ensureUniquePhone(phone);


        const hashedPwd = await hashPassword(payload.password);

        const userDoc = buildUserDoc({
            name: payload.name,
            email,
            password: hashedPwd,
            gender: payload.gender,
            phoneNumber: phone,
            extra: { ...payload.extra, ...payload.userData },
        });

        const Model = getRoleModel(roleKey);
        const created = await Model.create(userDoc);

        return { message: `User created successfully, you can login using this email: ${payload.email}.`, id: created._id };
    }
}

module.exports = new AuthService();
