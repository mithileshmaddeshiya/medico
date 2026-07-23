import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig } from "./firebaseConfig";

// getApps() guard — Next.js re-evaluates modules on every hot reload in dev,
// and a second initializeApp with the same name throws.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
