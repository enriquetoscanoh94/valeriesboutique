// Firebase Admin (lado servidor). Usa la cuenta de servicio guardada en
// la variable de entorno FIREBASE_SERVICE_ACCOUNT (JSON) del panel de Vercel.
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const ADMIN_EMAIL = "valeriesboutiqueadmin@gmail.com"

function ensureApp() {
  if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    initializeApp({ credential: cert(serviceAccount) })
  }
}

export function getAdminDb() {
  ensureApp()
  return getFirestore()
}

// Verifica que quien llama sea la administradora (por su token de Firebase).
export async function isAdminRequest(req) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (!token) return false
  try {
    ensureApp()
    const decoded = await getAuth().verifyIdToken(token)
    return decoded.email === ADMIN_EMAIL
  } catch {
    return false
  }
}
