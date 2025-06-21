const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { validateProfile } = require('../middleware/validation.js');
const { ProfileService } = require('../data/dynamodb.js');

const router = express.Router();

// GET /profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await ProfileService.getAllProfiles();
    res.json({ success: true, data: profiles, count: profiles.length });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve profiles' });
  }
});

// GET /profiles/:id
router.get('/:id', async (req, res) => {
  try {
    const profile = await ProfileService.getProfileById(req.params.id);
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve profile' });
  }
});

// POST /profiles
router.post('/', validateProfile, async (req, res) => {
  try {
    const profileData = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newProfile = await ProfileService.createProfile(profileData);
    res.status(201).json({ success: true, data: newProfile, message: 'Profile created successfully' });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ success: false, error: 'Failed to create profile' });
  }
});

// PUT /profiles/:id
router.put('/:id', validateProfile, async (req, res) => {
  try {
    const existing = await ProfileService.getProfileById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Profile not found' });

    const updated = await ProfileService.updateProfile(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json({ success: true, data: updated, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// DELETE /profiles/:id
router.delete('/:id', async (req, res) => {
  try {
    const existing = await ProfileService.getProfileById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Profile not found' });

    await ProfileService.deleteProfile(req.params.id);
    res.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ success: false, error: 'Failed to delete profile' });
  }
});

module.exports = router;
