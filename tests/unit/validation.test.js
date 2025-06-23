import { validateProfile } from '../../src/middleware/validation.js';

describe('Profile Validation Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should pass validation with valid profile data', () => {
        req.body = {
            name: 'John Doe',
            blood_group: 'O+',
            insurance_provider: 'Health Insurance Co',
            insurance_number: 'HIC123456',
            pdf_url: 'https://example.com/doc.pdf'
        };

        validateProfile(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('should fail validation when name is missing', () => {
        req.body = {
            blood_group: 'O+',
            insurance_provider: 'Health Insurance Co'
        };

        validateProfile(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: expect.stringContaining('name')
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('should fail validation when blood_group is missing', () => {
        req.body = {
            name: 'John Doe',
            insurance_provider: 'Health Insurance Co'
        };

        validateProfile(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: expect.stringContaining('blood_group')
        });
    });

    test('should allow empty insurance_number and pdf_url', () => {
        req.body = {
            name: 'John Doe',
            blood_group: 'O+',
            insurance_provider: 'Health Insurance Co',
            insurance_number: '',
            pdf_url: null
        };

        validateProfile(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});