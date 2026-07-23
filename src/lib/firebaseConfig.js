/**
 * Firebase project config, kept in its own module.
 *
 * `firebase.js` calls `initializeApp` at import time, which is fine in the
 * browser but pointless on the server — the lab pages read Firestore over its
 * REST API instead. Splitting the config out lets the server modules import
 * the project id and key without booting the whole SDK.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyByhyNyDwNnC1RSq7GL0FWLJI77iTMe-_A",
  authDomain: "medicobharat-1.firebaseapp.com",
  projectId: "medicobharat-1",
  storageBucket: "medicobharat-1.firebasestorage.app",
  messagingSenderId: "623585872367",
  appId: "1:623585872367:web:c3719e216dbd045bd90e1a",
};
