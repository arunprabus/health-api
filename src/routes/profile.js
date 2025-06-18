import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateProfile } from '../middleware/validation.js';
import { ProfileService } from '../data/dynamodb.js';

const router = express.Router();

// GET /api/profile - Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await ProfileService.getAllProfiles();
    
    res.json({
      success: true,
      data: profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve profiles'
    });
  }
});

// GET /api/profile/:id - Get specific profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await ProfileService.getProfileById(id);

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
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile'
    });
  }
});

// POST /api/profile - Create new profile
router.post('/', validateProfile, async (req, res) => {
  try {
    const { name, bloodGroup, insurance, email, idProof } = req.body;
    
    const profileId = uuidv4();
    const profileData = {
      id: profileId,
      name,
      bloodGroup,
      insurance,
      email,
      idProof,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newProfile = await ProfileService.createProfile(profileData);

    res.status(201).json({
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create profile'
    });
  }
});

// PUT /api/profile/:id - Update profile
router.put('/:id', validateProfile, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bloodGroup, insurance, email, idProof } = req.body;

    // Check if profile exists
    const existingProfile = await ProfileService.getProfileById(id);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const updateData = {
      name,
      bloodGroup,
      insurance,
      email,
      idProof,
      updatedAt: new Date().toISOString()
    };

    const updatedProfile = await ProfileService.updateProfile(id, updateData);

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// DELETE /api/profile/:id - Delete profile
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if profile exists
    const existingProfile = await ProfileService.getProfileById(id);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    await ProfileService.deleteProfile(id);

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete profile'
    });
  }
});

export default router;