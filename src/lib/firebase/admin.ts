
// DO NOT import this from client-side code!
// This file is only for server-side code (RSC/Server Actions).
import 'server-only';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

// This function initializes and returns the Firebase Admin App and Messaging instances.
// It will throw an error during initialization if the environment variable is not set,
// preventing the app from running with a broken configuration.
function initializeFirebaseAdmin(): { adminApp: App | null; adminMessaging: Messaging | null } {
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;

  if (!serviceAccountB64 || serviceAccountB64 === 'PASTE_BASE64_HERE') {
    console.warn('Firebase Admin not initialized. FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 is not set. Push notifications will not work.');
    return { adminApp: null, adminMessaging: null };
  }

  try {
    const serviceAccountJson = Buffer.from(serviceAccountB64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    // The private_key needs to have its newlines correctly formatted.
    const privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: privateKey,
          }),
        });

    return {
      adminApp: app,
      adminMessaging: getMessaging(app),
    };
  } catch (error: any) {
    console.error('CRITICAL: Failed to initialize Firebase Admin SDK:', error.message);
    // Re-throw the error to ensure the application fails to start if initialization is unsuccessful.
    throw new Error(`CRITICAL: Failed to parse or initialize Firebase Admin SDK. Please check the FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 variable. Original error: ${error.message}`);
  }
}

// Initialize and export the Firebase services.
// If initialization fails, the server will not start, and the error will be clear.
const { adminApp, adminMessaging } = initializeFirebaseAdmin();

export { adminApp, adminMessaging };
