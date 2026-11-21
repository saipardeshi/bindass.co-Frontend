import { createContext } from 'react'

// Context objects live in their own file so the provider files only export components
// (keeps React fast-refresh working) and hooks live in src/hooks.
export const AuthContext = createContext(null)
export const CartContext = createContext(null)
