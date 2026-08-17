import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useLanguage } from "../context/LanguageContext"

// Traduce los codigos de error de Firebase a un mensaje entendible.
function messageForError(code, t) {
  const errors = t.account.errors
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return errors.invalidCredential
    case "auth/email-already-in-use":
      return errors.emailInUse
    case "auth/weak-password":
      return errors.weakPassword
    case "auth/invalid-email":
      return errors.invalidEmail
    case "auth/popup-closed-by-user":
      return errors.popupClosed
    default:
      return errors.generic
  }
}

export default function AccountPage() {
  const { t } = useLanguage()
  const { user, loading, isAdmin, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth()

  const [mode, setMode] = useState("login") // "login" o "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const setField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const run = async (action) => {
    setError("")
    setBusy(true)
    try {
      await action()
    } catch (err) {
      setError(messageForError(err.code, t))
    } finally {
      setBusy(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (mode === "login") {
      run(() => loginWithEmail(form.email, form.password))
    } else {
      run(() => registerWithEmail(form.name, form.email, form.password))
    }
  }

  // Mientras Firebase revisa si ya habia sesion iniciada
  if (loading) {
    return (
      <div className="account-page section">
        <p className="account-loading">{t.account.loading}</p>
      </div>
    )
  }

  // 1) Ya tiene sesion iniciada
  if (user) {
    return (
      <div className="account-page section">
        <div className="account-card account-signed">
          <p className="eyebrow">Valerie&apos;s Boutique</p>
          <h1>{t.account.welcome}, {user.displayName || user.email}</h1>
          {isAdmin && <span className="account-badge">{t.account.adminBadge}</span>}
          <p className="account-email">{user.email}</p>
          {isAdmin && <Link className="button button-dark account-admin-link" to="/admin">{t.account.adminPanel}</Link>}
          <button className="account-logout" onClick={() => run(logout)} disabled={busy}>{t.account.logout}</button>
        </div>
      </div>
    )
  }

  // 2) No ha iniciado sesion: login o registro
  return (
    <div className="account-page section">
      <div className="account-card">
        <header className="account-heading">
          <p className="eyebrow">Valerie&apos;s Boutique</p>
          <h1>{t.account.title}</h1>
          <p className="account-subtitle">{t.account.loginSubtitle}</p>
        </header>

        <div className="account-tabs">
          <button type="button" className={mode === "login" ? "is-active" : ""} onClick={() => { setMode("login"); setError("") }}>{t.account.loginTab}</button>
          <button type="button" className={mode === "register" ? "is-active" : ""} onClick={() => { setMode("register"); setError("") }}>{t.account.registerTab}</button>
        </div>

        <button type="button" className="google-button" onClick={() => run(loginWithGoogle)} disabled={busy}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.5-4.8H1.5v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.5 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.5a12 12 0 0 0 0 10.7l4-3Z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.5 6.7l4 3.1C6.4 6.8 9 4.8 12 4.8Z"/></svg>
          {t.account.google}
        </button>

        <div className="account-divider"><span>{t.account.or}</span></div>

        <form className="account-form" onSubmit={handleSubmit} noValidate>
          {mode === "register" && (
            <div className="field">
              <label htmlFor="name">{t.account.name}</label>
              <input id="name" name="name" value={form.name} onChange={setField} autoComplete="name" />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">{t.account.email}</label>
            <input id="email" name="email" type="email" value={form.email} onChange={setField} autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">{t.account.password}</label>
            <input id="password" name="password" type="password" value={form.password} onChange={setField} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="button button-dark" type="submit" disabled={busy}>
            {mode === "login" ? t.account.loginButton : t.account.registerButton}
          </button>
        </form>

        <p className="account-switch">
          {mode === "login" ? t.account.noAccount : t.account.haveAccount}{" "}
          <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError("") }}>
            {mode === "login" ? t.account.switchToRegister : t.account.switchToLogin}
          </button>
        </p>
      </div>
    </div>
  )
}
