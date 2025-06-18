import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateProfile } from '../middleware/validation.js';
import { profiles } from '../data/storage.js';

const router = express.Router();

// GET /api/profile - Get all profiles
router.get('/', (req, res) => {
  try {
    const profileList = Object.values(profiles);
    res.json({
      success: true,
      data: profileList,
      count: profileList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve profiles'
    });
  }
});

// GET /api/profile/:id - Get specific profile
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const profile = profiles[id];

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile'
    });
  }
});

// POST /api/profile - Create new profile
router.post('/', validateProfile, (req, res) => {
  try {
    const { name, bloodGroup, insurance, email, idProof } = req.body;
    
    const profileId = uuidv4();
    const newProfile = {
      id: profileId,
      name,
      bloodGroup,
      insurance,
      email,
      idProof,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    profiles[profileId] = newProfile;

    res.status(201).json({
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create profile'
    });
  }
});

// PUT /api/profile/:id - Update profile
router.put('/:id', validateProfile, (req, res) => {
  try {
    const { id } = req.params;
    const { name, bloodGroup, insurance, email, idProof } = req.body;

    if (!profiles[id]) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    profiles[id] = {
      ...profiles[id],
      name,
      bloodGroup,
      insurance,
      email,
      idProof,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: profiles[id],
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// DELETE /api/profile/:id - Delete profile
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!profiles[id]) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    delete profiles[id];

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete profile'
    });
  }
});

export default router;