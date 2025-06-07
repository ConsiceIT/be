import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export const resolveCastHashFromUrl = async (req, res) => {
  const { url } = req.body;

  const regex = /^https:\/\/farcaster\.xyz\/([^/]+)\/(0x[0-9a-fA-F]+)$/;
  const match = url.match(regex);

  if (!match) {
    return res.status(400).json({ error: 'Invalid Farcaster.xyz URL format.' });
  }

  const username = match[1];
  const shortHash = match[2].toLowerCase();

  try {
    // Step 1: Get user FID
    const userRes = await axios.get(`https://api.neynar.com/v2/farcaster/user-by-username`, {
      params: { username },
      headers: { api_key: NEYNAR_API_KEY }
    });
    const fid = userRes.data.user.fid;

    // Step 2: Fetch user’s recent casts
    const castsRes = await axios.get(`https://api.neynar.com/v2/farcaster/user/casts`, {
      params: { fid, limit: 50 },
      headers: { api_key: NEYNAR_API_KEY }
    });

    const cast = castsRes.data.result.casts.find(c => c.hash.startsWith(shortHash));

    if (!cast) {
      return res.status(404).json({ error: 'No cast found matching that short hash.' });
    }

    return res.json({ fullHash: cast.hash });
  } catch (err) {
    console.error('Error resolving cast hash:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to resolve cast hash.' });
  }
};
