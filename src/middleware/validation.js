import Joi from 'joi';

const profileSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
  insurance: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  idProof: Joi.string().min(5).max(50).required()
});

export const validateProfile = (req, res, next) => {
  const { error } = profileSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};