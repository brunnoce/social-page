import { createContext } from "react"

export type AuthUser = {
  id: string
  username: string
  email: string
}

export type AuthContextType = {
  user: AuthUser | null
  isAuth: boolean
  loading: boolean
  refresh: () => Promise<void>
}

export const AuthContext =
  createContext<AuthContextType | null>(null)
