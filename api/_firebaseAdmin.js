// Inicializa Firebase Admin (lado servidor) una sola vez.
// Usa una cuenta de servicio guardada en la variable de entorno
// FIREBASE_SERVICE_ACCOUNT (JSON) del panel de Vercel.
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

export function getAdminDb() {
  if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    initializeApp({ credential: cert(serviceAccount) })
  }
  return getFirestore()
}
