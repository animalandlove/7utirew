import { db } from './firebase';
import { 
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc
} from 'firebase/firestore';
import { AnimalInfo } from './gemini';

export interface FavoriteAnimal extends AnimalInfo {
  id?: string;
  imageUrl: string;
  userId: string;
  createdAt: Date;
}

export const addToFavorites = async (
  userId: string,
  animalInfo: AnimalInfo,
  imageUrl: string
): Promise<string> => {
  const favoriteData: Omit<FavoriteAnimal, 'id'> = {
    ...animalInfo,
    imageUrl,
    userId,
    createdAt: new Date()
  };

  const docRef = await addDoc(collection(db, 'favorites'), favoriteData);
  return docRef.id;
};

export const removeFromFavorites = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'favorites', id));
};

export const getFavorites = async (userId: string): Promise<FavoriteAnimal[]> => {
  const q = query(
    collection(db, 'favorites'),
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as FavoriteAnimal));
};