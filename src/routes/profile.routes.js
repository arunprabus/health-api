import express from 'express';
import { 
    getProfiles, 
    getProfileById, 
    createProfile, 
    updateProfile, 
    deleteProfile 
} from '../controllers/profile.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all profile routes
// router.use(authenticateUser);

// Get all profiles (admin only in a real app)
router.get('/', getProfiles);

// Get profile by ID
router.get('/:id', getProfileById);

// Create new profile
router.post('/', createProfile);

// Update profile - support both PUT and POST for better compatibility
router.put('/:id', updateProfile);
router.post('/:id', updateProfile);

// Delete profile
router.delete('/:id', deleteProfile);

export default router;