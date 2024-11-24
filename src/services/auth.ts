import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface SignupData {
  email: string;
  password: string;
  name: string;
}

export const signup = async ({ email, password, name }: SignupData): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update user profile with name
  await updateProfile(user, { displayName: name });

  // Store additional user data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    name,
    email,
    createdAt: new Date()
  });

  return user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};