import { createContext, useContext, useState, useEffect } from 'react'
import authService from './services/authService'
import cartService from './services/cartService'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)

  const updateCartCount = async () => {
    if (user) {
      const count = await cartService.getCartItemCount()
      setCartCount(count)
    } else {
      setCartCount(0)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = authService.checkAuthStatus()
        
        if (authStatus.isAuthenticated) {
          setUser(authStatus.user)
          setLoading(false)
        } else {
          // Thử kiểm tra với server nếu không có user trong localStorage
          try {
            const profile = await authService.getProfile()
            setUser(profile)
            authService.saveAuthData({ user: profile })
          } catch (error) {
            console.log('User not authenticated')
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    updateCartCount()
  }, [])

  const login = (userData) => {
    setUser(userData)
    authService.saveAuthData({ user: userData })
  }

  const logout = () => {
    setUser(null)
    authService.clearAuthData()
  }

  const updateUser = (userData) => {
    setUser(userData)
    authService.saveAuthData({ user: userData })
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    cartCount,
    updateCartCount,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 