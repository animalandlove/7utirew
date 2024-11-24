import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getHistory, HistoryEntry } from '../services/history';
import { ResultCard } from '../components/ResultCard';
import toast from 'react-hot-toast';

export const History = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userHistory = await getHistory(currentUser.uid);
        setHistory(userHistory);
      } catch (error) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to view your history</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your History
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View your past animal identifications and insights
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
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No history yet</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {history.map((entry) => (
            <ResultCard
              key={entry.id}
              {...entry}
            />
          ))}
        </div>
      )}
    </main>
  );
};