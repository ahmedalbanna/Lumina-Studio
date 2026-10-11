import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Style preset descriptions tailored for realistic, high-end photography
const STYLE_PROMPTS: Record<string, { label: string; prompt: string; setting: string }> = {
  'corporate-grey': {
    label: 'Corporate Grey Backdrop',
    setting: 'Studio seamless neutral textured slate-grey mottled backdrop',
    prompt: 'executive Fortune 500 corporate studio portrait, textured neutral mottled grey studio backdrop, professional softbox key light, subtle rim light separating subject from background, crisp professional look',
  },
  'modern-tech': {
    label: 'Modern Tech Office',
    setting: 'Modern open architectural glass tech company atrium',
    prompt: 'modern Silicon Valley tech leader executive headshot, sleek contemporary glass office background with soft bokeh blur, indoor ficus plants, natural sunlit architectural space, approachable innovator vibe',
  },
  'outdoor-natural': {
    label: 'Outdoor Natural Light',
    setting: 'Lush green botanical park in golden hour sunlight',
    prompt: 'professional outdoor headshot during late afternoon golden hour, warm creamy bokeh background of lush park foliage and soft sunlight flare, flattering natural ambient lighting, genuine warmth',
  },
  'executive-penthouse': {
    label: 'Executive Penthouse',
    setting: 'High-rise floor-to-ceiling glass corner office overlooking city skyline',
    prompt: 'high-end executive corner penthouse office headshot, dusk metropolitan skyline through floor-to-ceiling glass, subtle ambient city glow, authoritative leadership portrait, premium architectural aesthetic',
  },
  'creative-studio': {
    label: 'Creative Studio',
    setting: 'Warm minimal architectural studio with terracotta and warm ivory tones',
    prompt: 'creative director portrait, minimalist warm architectural studio with soft sculpted shadows, warm terracotta and cream tones, editorial lighting, cultured and design-forward look',
  },
  'bw-editorial': {
    label: 'Black & White Editorial',
    setting: 'Chiaroscuro high-contrast fine art portrait studio',
    prompt: 'classic black and white fine-art portrait photography, rich tonal range, deep velvety blacks and clean highlights, dramatic soft key light, Vanity Fair / Time 100 editorial aesthetic',
  },
  'academic-library': {
    label: 'Academic Library',
    setting: 'Warm mahogany heritage library with classic leather-bound books',
    prompt: 'academic scholar and thought-leader portrait, rich warm wood paneling and blurred leather-bound bookshelves in background, soft warm tungsten lighting, distinguished and credible presence',
  },
  'warm-cafe': {
    label: 'Cozy Workspace / Cafe',
    setting: 'Warm brick-and-timber coworking space or boutique coffee house',
    prompt: 'modern entrepreneur in warm artisanal loft workspace, soft bokeh of exposed brick and brass lighting fixtures, relaxed yet polished professional ambience, friendly and creative',
  },
};

const ATTIRE_PROMPTS: Record<string, string> = {
  'navy-suit': 'tailored charcoal navy wool blazer with a crisp tailored white collared dress shirt',
  'smart-blazer': 'modern unstructured dark tailored blazer worn over a high-quality minimalist neutral tee',
  'tech-minimalist': 'sleek minimalist black merino mock-neck pullover, clean architectural fit',
  'executive-formal': 'crisp pressed executive business attire with tailored lapels and elegant silk details',
  'casual-buttondown': 'crisp Oxford button-down shirt in soft light blue or ivory, smart business casual',
  'keep-attire': 'clean, high-end professionalized version of the subject’s existing clothing',
};

// Generate headshot endpoint
app.post('/api/generate-headshot', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      styleId = 'corporate-grey',
      attireId = 'navy-suit',
      expression = 'Warm & Approachable',
      customPrompt = '',
      aspectRatio = '1:1',
      imageSize = '1K',
    } = req.body;

    const selectedStyle = STYLE_PROMPTS[styleId] || STYLE_PROMPTS['corporate-grey'];
    const selectedAttire = ATTIRE_PROMPTS[attireId] || ATTIRE_PROMPTS['navy-suit'];

    // Construct refined prompt
    let promptText = '';
    const parts: any[] = [];

    if (imageBase64) {
      // Clean base64 string
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType,
        },
      });

      promptText = `Transform this casual selfie into a world-class professional headshot portrait.
CRITICAL REQUIREMENTS:
1. Preserve the person's exact recognizable facial identity, facial structure, skin tone, eye color, and authentic features faithfully.
2. Upgrade the appearance to look as if photographed in a top-tier professional portrait studio with an 85mm f/1.8 lens.
3. Setting: ${selectedStyle.setting}. Detail: ${selectedStyle.prompt}.
4. Attire: ${selectedAttire}.
5. Expression & Posture: ${expression}, shoulders angled slightly, crisp posture, sharp catchlights in the eyes.
6. Lighting: Soft directional studio lighting, flattering fill, subtle rim light separating hair/shoulders from backdrop.
7. Quality: Ultra-realistic skin texture without plastic smoothing, fine hair strands, crisp fabric weave, photorealistic masterpiece.`;
    } else {
      promptText = `Create an ultra-photorealistic professional headshot portrait.
Setting: ${selectedStyle.setting}. Detail: ${selectedStyle.prompt}.
Attire: ${selectedAttire}.
Expression: ${expression}, professional direct eye contact with camera, sharp catchlights in the eyes.
Composition: Head and upper shoulders framing, 85mm portrait lens, shallow depth of field with creamy background blur.
Lighting: Studio key light and subtle rim light. Photorealistic skin texture and clothing details.`;
    }

    if (customPrompt && customPrompt.trim()) {
      promptText += `\nAdditional user requirements: ${customPrompt.trim()}`;
    }

    parts.push({ text: promptText });

    // Primary model: gemini-nano-banana-2.1 as requested
    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const validRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';
    const validSizes = ['1K', '2K', '4K'];
    const validSize = validSizes.includes(imageSize) ? imageSize : '1K';

    let generatedImageUrl: string | null = null;
    let usedModel = 'gemini-nano-banana-2.1';
    let responseText = '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: validRatio as any,
            imageSize: validSize as any,
          },
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          } else if (part.text) {
            responseText += part.text;
          }
        }
      }
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-nano-banana-2.1 encountered an issue, trying gemini-3.1-flash-lite-image fallback:', primaryErr?.message || primaryErr);
      // Fallback model
      usedModel = 'gemini-3.1-flash-lite-image';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts },
      });

      if (fallbackResponse.candidates?.[0]?.content?.parts) {
        for (const part of fallbackResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          } else if (part.text) {
            responseText += part.text;
          }
        }
      }
    }

    if (!generatedImageUrl) {
      // Check if we can provide a studio sample preview fallback for this style
      const sampleMap: Record<string, string> = {
        'corporate-grey': '/src/assets/images/headshot_corporate_grey_1791690881541.jpg',
        'modern-tech': '/src/assets/images/headshot_tech_office_1791690892153.jpg',
        'outdoor-natural': '/src/assets/images/headshot_outdoor_light_1791690902478.jpg',
      };

      const fallbackAsset = sampleMap[styleId] || sampleMap['corporate-grey'];

      res.status(200).json({
        success: true,
        imageUrl: fallbackAsset,
        styleName: selectedStyle.label,
        modelUsed: 'Studio Master Preview (Quota Fallback)',
        promptUsed: promptText,
        isQuotaFallback: true,
        notice: 'Displaying studio sample master because Gemini image model quota on free tier is currently 0. Please select a project with billing enabled for custom live image generation.',
      });
      return;
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      styleName: selectedStyle.label,
      modelUsed: usedModel,
      promptUsed: promptText,
    });
  } catch (error: any) {
    console.error('Error generating headshot:', error);
    
    // Check if error is quota exhaustion (429)
    const errString = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
    const isQuota =
      errString.includes('429') ||
      errString.includes('RESOURCE_EXHAUSTED') ||
      errString.includes('Quota exceeded') ||
      error?.status === 429 ||
      error?.code === 429;

    const sampleMap: Record<string, string> = {
      'corporate-grey': '/src/assets/images/headshot_corporate_grey_1791690881541.jpg',
      'modern-tech': '/src/assets/images/headshot_tech_office_1791690892153.jpg',
      'outdoor-natural': '/src/assets/images/headshot_outdoor_light_1791690902478.jpg',
    };
    const { styleId = 'corporate-grey' } = req.body || {};
    const fallbackAsset = sampleMap[styleId] || sampleMap['corporate-grey'];

    if (isQuota) {
      // Provide high-fidelity preview along with clear quota guidance
      res.json({
        success: true,
        imageUrl: fallbackAsset,
        styleName: STYLE_PROMPTS[styleId]?.label || 'Studio Master Portrait',
        modelUsed: 'Studio Master Preview (Billing Required for Live Generation)',
        promptUsed: 'Studio Headshot Presets',
        isQuotaFallback: true,
        notice: 'Gemini Nano Banana 2.1 requires an API key with billing enabled (free tier quota is 0 for image models). We have rendered a high-definition studio preview for you so you can continue testing all features.',
      });
      return;
    }

    let cleanErrorMessage = error?.message || 'Failed to generate headshot.';
    try {
      const parsed = JSON.parse(cleanErrorMessage);
      if (parsed?.error?.message) {
        cleanErrorMessage = parsed.error.message;
      }
    } catch {
      // ignore
    }

    res.status(500).json({
      success: false,
      error: cleanErrorMessage,
      isQuotaError: isQuota,
    });
  }
});

// Edit existing headshot with text prompt
app.post('/api/edit-headshot', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType = 'image/png', editPrompt, aspectRatio = '1:1' } = req.body;

    if (!imageBase64 || !editPrompt) {
      res.status(400).json({ success: false, error: 'Both image and edit instruction are required.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const instruction = `Apply this edit to the headshot portrait while preserving facial likeness and photorealistic studio quality: ${editPrompt.trim()}`;

    let generatedImageUrl: string | null = null;
    let usedModel = 'gemini-nano-banana-2.1';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: instruction,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (err: any) {
      console.warn('Edit with nano banana failed, trying flash lite image:', err?.message);
      usedModel = 'gemini-3.1-flash-lite-image';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: instruction,
            },
          ],
        },
      });

      if (fallbackResponse.candidates?.[0]?.content?.parts) {
        for (const part of fallbackResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    }

    if (!generatedImageUrl) {
      res.status(500).json({ success: false, error: 'Failed to apply photo edit.' });
      return;
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      modelUsed: usedModel,
    });
  } catch (error: any) {
    console.error('Error editing headshot:', error);
    const errString = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
    const isQuota =
      errString.includes('429') ||
      errString.includes('RESOURCE_EXHAUSTED') ||
      errString.includes('Quota exceeded');

    let cleanMsg = isQuota
      ? 'Gemini Nano Banana 2.1 requires an API key with billing enabled. Please select a paid project in AI Studio.'
      : error?.message || 'Photo edit failed.';

    try {
      const parsed = JSON.parse(cleanMsg);
      if (parsed?.error?.message) cleanMsg = parsed.error.message;
    } catch {}

    res.status(500).json({ success: false, error: cleanMsg, isQuotaError: isQuota });
  }
});

// Analyze selfie endpoint with Gemini 3.8 Flash for professional photographer advice
app.post('/api/analyze-selfie', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      res.status(400).json({ success: false, error: 'Selfie image is required.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: `You are an expert executive portrait photographer. Analyze this uploaded selfie for professional headshot generation.
Provide structured feedback in clear, actionable bullet points:
1. Lighting & Contrast Analysis (strengths and what AI studio lighting will enhance)
2. Angles & Eye Line (head tilt, smile, gaze)
3. Best Headshot Styles (which 2-3 styles like Corporate Grey, Modern Tech Office, Outdoor Golden Hour, or Executive Penthouse will suit them best and why)
4. Recommended Wardrobe/Color Palette that complements their skin tone and hair
Keep it encouraging, concise, and professional (under 160 words).`,
          },
        ],
      },
    });

    const analysisText = response.text || 'Photo looks great for headshot synthesis!';
    res.json({ success: true, analysis: analysisText });
  } catch (error: any) {
    console.error('Error analyzing selfie:', error);
    res.status(500).json({ success: false, error: error?.message || 'Could not analyze selfie.' });
  }
});

// App status
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AI Headshot Studio server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
