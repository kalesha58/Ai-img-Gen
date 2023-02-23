import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: "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",
  // apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  const { prompt } = req.body;

  // const imageSize =
  //   size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data.data[0].url;

    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
});

export default router;
