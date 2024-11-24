import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface AnimalInfo {
  species: string;
  scientificName: string;
  confidence: number;
  habitat: string;
  diet: string;
  conservationStatus: string;
}

export async function identifyAnimal(imageData: string): Promise<AnimalInfo> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your environment variables.');
  }

  try {
    // Use gemini-pro-vision model for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Remove data URL prefix and convert to base64
    const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    // Prepare image part for the model
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    };

    // Create a more specific prompt for better results
    const prompt = `Analyze this image and identify the animal. Return a JSON object with the following properties:
    {
      "species": "common name of the animal",
      "scientificName": "Latin name",
      "confidence": "numerical percentage (e.g., 95)",
      "habitat": "natural habitat description",
      "diet": "what the animal typically eats",
      "conservationStatus": "IUCN Red List status if known"
    }
    
    If no animal is detected, return: {"error": "No animal detected in image"}`;

    // Generate content with both image and prompt
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();

    // Extract and parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from API');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    if (parsedResponse.error) {
      throw new Error(parsedResponse.error);
    }

    // Validate and format the response
    return {
      species: parsedResponse.species || 'Unknown Species',
      scientificName: parsedResponse.scientificName || 'Unknown',
      confidence: typeof parsedResponse.confidence === 'number' 
        ? parsedResponse.confidence 
        : parseInt(parsedResponse.confidence) || 85,
      habitat: parsedResponse.habitat || 'Information not available',
      diet: parsedResponse.diet || 'Information not available',
      conservationStatus: parsedResponse.conservationStatus || 'Unknown'
    };
  } catch (error) {
    console.error('Error in identifyAnimal:', error);
    if (error instanceof Error) {
      if (error.message.includes('No animal detected')) {
        throw new Error('No animal was detected in the image. Please try a different image.');
      }
      throw error;
    }
    throw new Error('Failed to identify animal. Please try again.');
  }
}