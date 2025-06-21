export async function getProfiles(req, res) {
    res.json({ profiles: [] });
}

export async function createProfile(req, res) {
    res.status(201).json({ message: 'Profile created' });
}