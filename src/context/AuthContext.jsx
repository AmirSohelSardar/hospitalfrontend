import { createContext, useReducer, useEffect } from "react";

const initialState = {
  // FIX: localStorage.getItem returns null (not undefined) for missing keys,
  // so the original condition `!== undefined` was always true and could
  // cause JSON.parse(null) = null which is fine, but misleading.
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  role: localStorage.getItem('role') || null,
  token: localStorage.getItem('token') || null,
  // FIX: userId and isPremiumUser were in initialState but never set in
  // LOGIN_SUCCESS, so they'd always be null/stale after login until page reload
  userId: localStorage.getItem('userId') || null,
  isPremiumUser: localStorage.getItem('premiumstatus') === 'true' ? true : false,
}

export const authContext = createContext(initialState)

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        role: null,
        token: null,
        isPremiumUser: false,
        userId: null,
      }

    case 'LOGIN_SUCCESS':
      const isAdmin = action.payload.role === 'admin';
      // FIX: userId and isPremiumUser were missing from returned state,
      // so they were never updated in context after login
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: isAdmin ? 'admin' : action.payload.role,
        userId: action.payload.userId || null,
        isPremiumUser: action.payload.isPremiumUser || false,
      }

    case 'LOGOUT':
      localStorage.clear();
      return {
        user: null,
        role: null,
        token: null,
        isPremiumUser: false,
        userId: null,
      }

    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user))
    localStorage.setItem("token", state.token)
    localStorage.setItem("role", state.role)
    localStorage.setItem("userId", state.userId)
    // FIX: store as string explicitly so retrieval comparison works correctly
    localStorage.setItem("premiumstatus", String(state.isPremiumUser))
  }, [state])

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        userId: state.userId,
        isPremiumUser: state.isPremiumUser,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  )
}