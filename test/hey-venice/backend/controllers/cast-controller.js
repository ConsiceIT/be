import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export const getCastWithReplies = async (req, res) => {
  const { hash } = req.params;

  console.log('getCastWithReplies ==>', hash);
  console.log('NEYNAR_API_KEY ==>', NEYNAR_API_KEY);

  // Validate API key
  if (!NEYNAR_API_KEY) {
    console.error('NEYNAR_API_KEY is not defined in environment variables');
    return res.status(500).json({ 
      error: 'Server configuration error', 
      message: 'API key is missing' 
    });
  }

  try {
    // Get the cast
    const castRes = await axios.get(`https://api.neynar.com/v2/farcaster/cast`, {
      params: { identifier: hash, type: 'hash' },
      headers: { 'api_key': NEYNAR_API_KEY }
    });

    // Validate cast response structure
    if (!castRes.data || !castRes.data.cast) {
      console.error('Invalid cast response structure:', castRes.data);
      return res.status(500).json({
        error: 'Invalid API response',
        message: 'The cast data structure from Neynar API is not as expected',
        details: { responseData: castRes.data }
      });
    }

    // Get replies to the cast
    const replyRes = await axios.get(`https://api.neynar.com/v2/farcaster/cast/replies`, {
      params: { identifier: hash, type: 'hash' },
      headers: { 'api_key': NEYNAR_API_KEY }
    });

    // Validate replies response structure
    if (!replyRes.data || !replyRes.data.result || !replyRes.data.result.replies) {
      console.error('Invalid replies response structure:', replyRes.data);
      return res.status(500).json({
        error: 'Invalid API response',
        message: 'The replies data structure from Neynar API is not as expected',
        details: { responseData: replyRes.data }
      });
    }

    res.json({
      cast: castRes.data.cast,
      replies: replyRes.data.result.replies
    });
  } catch (error) {
    console.error('Error fetching cast data:', error.response?.data || error.message);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Check if it's a "not found" error
    if (error.response?.status === 404 || error.response?.data?.code === 'NotFound') {
      return res.status(404).json({ 
        error: 'Cast not found', 
        details: error.response?.data || error.message 
      });
    }

    // Check for API key related errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(500).json({
        error: 'API authentication error',
        message: 'Failed to authenticate with Neynar API',
        details: error.response?.data || error.message
      });
    }

    // Handle other errors
    res.status(500).json({ 
      error: 'Failed to fetch cast or replies',
      message: error.message,
      details: error.response?.data
    });
  }
};
