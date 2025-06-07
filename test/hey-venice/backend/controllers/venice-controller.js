import axios from "axios";

export const handlePrompt = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  try {
    const veniceRes = await axios.post(
      "https://api.venice.ai/api/v1/chat/completions",
      {
        model: "venice-uncensored",
        messages: [
          {
            role: "system",
            content: "You are a summarizer",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        venice_parameters: {
          enable_web_search: "on",
          include_venice_system_prompt: true,
        },
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        max_completion_tokens: 998,
        temperature: 0.3,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VENICE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = veniceRes.data?.choices?.[0]?.message?.content;
    res.json({ result: content });
  } catch (error) {
    console.error("Venice API error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch response from Venice AI" });
  }
};
