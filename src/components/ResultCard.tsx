import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { AnimalInfo } from '../services/gemini';

interface ResultCardProps extends AnimalInfo {
  imageUrl: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  imageUrl,
  species,
  scientificName,
  confidence,
  habitat,
  diet,
  conservationStatus
}) => {
  const animalData = {
    species,
    scientificName,
    confidence,
    habitat,
    diet,
    conservationStatus
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-64">
        <img
          src={imageUrl}
          alt={species}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors group">
            <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500" />
          </button>
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors group">
            <Share2 className="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
          </button>
          <ExportButton data={animalData} imageUrl={imageUrl} format="pdf" />
          <ExportButton data={animalData} imageUrl={imageUrl} format="csv" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{species}</h3>
            <p className="text-sm text-gray-500 italic">{scientificName}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
            {confidence}% Match
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Habitat</h4>
            <p className="mt-1 text-gray-600">{habitat}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Diet</h4>
            <p className="mt-1 text-gray-600">{diet}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Conservation Status</h4>
            <span className="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              {conservationStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};