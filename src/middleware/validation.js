// validation.js
import Joi from 'joi';

const validateProfile = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    blood_group: Joi.string().required(),
    insurance_provider: Joi.string().required(),
    insurance_number: Joi.string().allow(null, ''),
    pdf_url: Joi.string().allow(null, '').optional()
  }).unknown(false);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  next();
};

export { validateProfile };
