import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites, FavoriteAnimal, removeFromFavorites } from '../services/favorites';
import { ResultCard } from '../components/ResultCard';
import toast from 'react-hot-toast';

export const Favorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userFavorites = await getFavorites(currentUser.uid);
        setFavorites(userFavorites);
      } catch (error) {
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [currentUser]);

  const handleRemoveFromFavorites = async (id: string) => {
    try {
      await removeFromFavorites(id);
      setFavorites(favorites.filter(fav => fav.id !== id));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  if (!currentUser) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to view your favorites</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Favorites
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access your saved animal identifications
        </p>
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm p-8">
              <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No favorites yet</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <ResultCard
              key={favorite.id}
              {...favorite}
              onRemoveFromFavorites={() => favorite.id && handleRemoveFromFavorites(favorite.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
};