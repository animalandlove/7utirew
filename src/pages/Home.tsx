import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ImageUpload } from '../components/ImageUpload';
import { ResultCard } from '../components/ResultCard';
import { identifyAnimal, type AnimalInfo } from '../services/gemini';
import { addToHistory } from '../services/history';
import { toast } from 'react-hot-toast';

export const Home = () => {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [animalInfo, setAnimalInfo] = useState<AnimalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setSelectedImage(imageData);
      
      try {
        setIsLoading(true);
        const result = await identifyAnimal(imageData);
        setAnimalInfo(result);

        // Save to history if user is logged in
        if (currentUser) {
          await addToHistory(currentUser.uid, result, imageData);
        }
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to identify animal. Please try again.';
        toast.error(errorMessage);
        setSelectedImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read image file. Please try again.');
      setSelectedImage(null);
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Identify Any Animal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a photo to instantly identify animal species and learn about their characteristics, habitat, and conservation status.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <ImageUpload onImageSelect={handleImageSelect} />
      </div>

      {isLoading && (
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      )}

      {!isLoading && selectedImage && animalInfo && (
        <div className="max-w-3xl mx-auto">
          <ResultCard
            imageUrl={selectedImage}
            {...animalInfo}
          />
        </div>
      )}
    </main>
  );
};