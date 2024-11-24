import { db } from './firebase';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { AnimalInfo } from './gemini';

export interface HistoryEntry extends AnimalInfo {
  id?: string;
  imageUrl: string;
  userId: string;
  timestamp: Date;
}

export const addToHistory = async (
  userId: string,
  animalInfo: AnimalInfo,
  imageUrl: string
): Promise<string> => {
  const historyData: Omit<HistoryEntry, 'id'> = {
    ...animalInfo,
    imageUrl,
    userId,
    timestamp: new Date()
  };

  const docRef = await addDoc(collection(db, 'history'), historyData);
  return docRef.id;
};

export const getHistory = async (userId: string): Promise<HistoryEntry[]> => {
  const q = query(
    collection(db, 'history'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HistoryEntry));
};