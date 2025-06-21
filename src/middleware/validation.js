// validation.js
const Joi = require('joi');

const validateProfile = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    bloodGroup: Joi.string().required(),
    insurance: Joi.string().required(),
    email: Joi.string().email().required(),
    idProof: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  next();
};

module.exports = { validateProfile };
