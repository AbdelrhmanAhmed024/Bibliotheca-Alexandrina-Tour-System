const guideRepo = require('./guide.repository');
const AppError = require('../utils/AppError');

class GuideService {
    async getAllGuides() {
        const guides = await guideRepo.findAll();
        if (!guides || guides.length === 0) {
            throw new AppError('No guides found', 404);
        }
        return guides;
    }

    async getGuideById(id) {
        const guide = await guideRepo.findById(id);
        if (!guide) {
            throw new AppError('Guide not found', 404);
        }
        return guide;
    }

    async createGuide(data) {
        // Validate required fields
        if (!data.languages || !data.languages.length) {
            throw new AppError('At least one language is required', 400);
        }
        if (!data.specialization) {
            throw new AppError('Specialization is required', 400);
        }
        if (!data.yearsOfExperience) {
            throw new AppError('Years of experience is required', 400);
        }

        const guide = await guideRepo.create(data);
        if (!guide) {
            throw new AppError('Error creating guide', 400);
        }
        return guide;
    }

    async updateGuide(id, data) {
        // Prevent password updates through this route
        if (data.password) {
            delete data.password;
        }

        const guide = await guideRepo.updateById(id, data);
        if (!guide) {
            throw new AppError('Guide not found or can\'t be updated', 404);
        }
        return guide;
    }

    async deleteGuide(id) {
        const guide = await guideRepo.deleteById(id);
        if (!guide) {
            throw new AppError('Guide not found', 404);
        }
        return guide;
    }

    async findAvailableGuides(date) {
        if (!date) {
            throw new AppError('Date is required', 400);
        }

        const guides = await guideRepo.findAvailableGuides(new Date(date));
        if (!guides || guides.length === 0) {
            throw new AppError('No available guides found for this date', 404);
        }
        return guides;
    }

    async findGuidesByLanguage(language) {
        if (!language) {
            throw new AppError('Language is required', 400);
        }

        const guides = await guideRepo.findByLanguage(language);
        if (!guides || guides.length === 0) {
            throw new AppError('No guides found for this language', 404);
        }
        return guides;
    }

    async findGuidesBySpecialization(specialization) {
        if (!specialization) {
            throw new AppError('Specialization is required', 400);
        }

        const guides = await guideRepo.findBySpecialization(specialization);
        if (!guides || guides.length === 0) {
            throw new AppError('No guides found for this specialization', 404);
        }
        return guides;
    }

    async findGuidesByExperience(minYears) {
        if (!minYears || minYears < 0) {
            throw new AppError('Valid minimum years of experience is required', 400);
        }

        const guides = await guideRepo.findByExperience(minYears);
        if (!guides || guides.length === 0) {
            throw new AppError('No guides found with this experience level', 404);
        }
        return guides;
    }
}

module.exports = new GuideService();