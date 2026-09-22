import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/api/me", {
      method: "GET",
      credentials: "include"
    })
      .then(async response => {
        if (!response.ok) {
          setUser(null)
          return
        }
        const data = await response.json()
        setUser(data)
      })
      .finally(() => {
        setLoadingUser(false)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}