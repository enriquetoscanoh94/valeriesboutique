import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth"
import { auth, googleProvider } from "../firebase"

const AuthContext = createContext(null)

// El correo de la duena. Quien entre con este correo es la administradora.
export const ADMIN_EMAIL = "valeriesboutiqueadmin@gmail.com"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase nos avisa cada vez que el usuario entra o sale.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const registerWithEmail = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(credential.user, { displayName: name })
    return credential
  }

  const logout = () => signOut(auth)

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin: user?.email === ADMIN_EMAIL,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export const useAuth = () => useContext(AuthContext)
