// Nano Banana (Gemini 2.5 Flash Image) Client
// Primary image generation service for the mythology project

import { 
  ImageGenerationRequest, 
  ImageGenerationResponse,
  ImageStatus,
  GeneratedImage
} from './types';
import { buildImagePrompt } from './promptBuilder';
import { runFullSafetyCheck, FullSafetyCheck } from './safetyFilter';

// =====================================================
// CONFIGURATION
// =====================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';

// Fallback to DALL-E if Gemini fails
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_DALLE_FALLBACK = true;

// =====================================================
// TYPES
// =====================================================

interface GeminiImageResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          mimeType: string;
          data: string; // base64 encoded image
        };
        text?: string;
      }>;
    };
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

// =====================================================
// GEMINI IMAGE GENERATION
// =====================================================

/**
 * Generate an image using Google's Gemini (Nano Banana) API
 */
async function generateWithGemini(prompt: string): Promise<{
  success: boolean;
  imageData?: string; // base64
  mimeType?: string;
  error?: string;
}> {
  if (!GEMINI_API_KEY) {
    return { success: false, error: 'Gemini API key not configured' };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', response.status, errorText);
      return { success: false, error: `Gemini API error: ${response.status} - ${errorText}` };
    }

    const data: GeminiImageResponse = await response.json();
    console.log('📦 Gemini response structure:', JSON.stringify({
      hasCandidates: !!data.candidates,
      candidateCount: data.candidates?.length,
      hasError: !!data.error,
      errorMessage: data.error?.message,
      firstCandidateParts: data.candidates?.[0]?.content?.parts?.length
    }));

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) {
      return { success: false, error: 'No content in response' };
    }

    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart?.inlineData) {
      return { success: false, error: 'No image in response' };
    }

    return {
      success: true,
      imageData: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType
    };
  } catch (error) {
    console.error('Gemini generation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// =====================================================
// DALL-E FALLBACK
// =====================================================

/**
 * Generate an image using DALL-E as fallback
 */
async function generateWithDallE(prompt: string): Promise<{
  success: boolean;
  imageUrl?: string;
  error?: string;
}> {
  if (!OPENAI_API_KEY) {
    return { success: false, error: 'OpenAI API key not configured' };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.error?.message || `DALL-E API error: ${response.status}` 
      };
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return { success: false, error: 'No image URL in response' };
    }

    return { success: true, imageUrl };
  } catch (error) {
    console.error('DALL-E generation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// =====================================================
// MAIN GENERATION FUNCTION
// =====================================================

export interface GenerationResult {
  success: boolean;
  imageData?: string; // base64 or URL
  imageFormat: 'base64' | 'url';
  mimeType?: string;
  provider: 'gemini' | 'dalle' | 'none';
  safetyCheck: FullSafetyCheck;
  prompt: string;
  error?: string;
}

/**
 * Generate an image for a mythology entity
 * Uses Gemini (Nano Banana) as primary, DALL-E as fallback
 */
export async function generateImage(
  request: ImageGenerationRequest
): Promise<GenerationResult> {
  // Step 1: Build the prompt
  const { safetyWrappedPrompt, basePrompt, fullPrompt } = buildImagePrompt(request);
  
  // Step 2: Run safety check
  const safetyCheck = runFullSafetyCheck(basePrompt, request.studentAddition);
  
  if (!safetyCheck.allowed) {
    return {
      success: false,
      imageFormat: 'base64',
      provider: 'none',
      safetyCheck,
      prompt: fullPrompt,
      error: safetyCheck.errors.join('. ')
    };
  }
  
  // Step 3: Try Gemini first
  console.log('🍌 Attempting Nano Banana (Gemini) generation...');
  console.log('🔑 Gemini API Key configured:', !!GEMINI_API_KEY);
  const geminiResult = await generateWithGemini(safetyWrappedPrompt);
  
  if (geminiResult.success && geminiResult.imageData) {
    console.log('✅ Nano Banana generation successful!');
    return {
      success: true,
      imageData: geminiResult.imageData,
      imageFormat: 'base64',
      mimeType: geminiResult.mimeType,
      provider: 'gemini',
      safetyCheck,
      prompt: fullPrompt
    };
  }
  
  // Log why Gemini failed
  console.log('❌ Gemini failed:', geminiResult.error);
  
  // Step 4: Fallback to DALL-E if enabled
  if (USE_DALLE_FALLBACK) {
    console.log('🔄 Falling back to DALL-E...');
    const dalleResult = await generateWithDallE(safetyWrappedPrompt);
    
    if (dalleResult.success && dalleResult.imageUrl) {
      console.log('✅ DALL-E generation successful!');
      return {
        success: true,
        imageData: dalleResult.imageUrl,
        imageFormat: 'url',
        provider: 'dalle',
        safetyCheck,
        prompt: fullPrompt
      };
    }
    
    return {
      success: false,
      imageFormat: 'base64',
      provider: 'none',
      safetyCheck,
      prompt: fullPrompt,
      error: `Gemini: ${geminiResult.error}. DALL-E: ${dalleResult.error}`
    };
  }
  
  return {
    success: false,
    imageFormat: 'base64',
    provider: 'none',
    safetyCheck,
    prompt: fullPrompt,
    error: geminiResult.error
  };
}

// =====================================================
// BATCH GENERATION (For trading cards, evolution, etc.)
// =====================================================

/**
 * Generate multiple images in sequence
 * Useful for trading card sets or character evolutions
 */
export async function generateBatch(
  requests: ImageGenerationRequest[],
  delayBetween: number = 2000 // 2 seconds between requests
): Promise<GenerationResult[]> {
  const results: GenerationResult[] = [];
  
  for (let i = 0; i < requests.length; i++) {
    console.log(`🖼️ Generating image ${i + 1} of ${requests.length}...`);
    
    const result = await generateImage(requests[i]);
    results.push(result);
    
    // Delay between requests to avoid rate limiting
    if (i < requests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetween));
    }
  }
  
  return results;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Convert base64 image data to a data URL
 */
export function base64ToDataUrl(base64: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Check if the image generation service is available
 */
export async function checkServiceHealth(): Promise<{
  gemini: boolean;
  dalle: boolean;
  anyAvailable: boolean;
}> {
  const geminiAvailable = !!GEMINI_API_KEY;
  const dalleAvailable = !!OPENAI_API_KEY;
  
  return {
    gemini: geminiAvailable,
    dalle: dalleAvailable,
    anyAvailable: geminiAvailable || dalleAvailable
  };
}

/**
 * Estimate cost for a batch of images
 */
export function estimateCost(
  count: number,
  provider: 'gemini' | 'dalle' = 'gemini'
): { cost: number; currency: string } {
  const costs = {
    gemini: 0.039, // $0.039 per image
    dalle: 0.04    // $0.04 per image (standard)
  };
  
  return {
    cost: count * costs[provider],
    currency: 'USD'
  };
}
