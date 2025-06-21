export async function signup(req, res) {
    res.json({ message: 'Mock signup successful' });
}

export async function login(req, res) {
    const token = 'mock-jwt-token';
    res.json({ token });
}