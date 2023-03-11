export const NOTE_TITLE_MAX_LENGTH = 128;
export const NOTE_CATEGORY_MAX_LENGTH = 32;
export const NOTE_TAGS_MAX_LENGTH = 5;
export const NOTE_TAGS_MAX_LENGTH_PER_TAG = 16;
export const NOTE_TAGS_SEPARATOR = ', ';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

type FirebaseConfig = typeof firebaseConfig;

export function getFirebaseConfig(): FirebaseConfig {
  Object.values(firebaseConfig).some((value) => {
    if (!value) {
      throw new Error('Missing Firebase config');
    }
  });

  return firebaseConfig;
}
