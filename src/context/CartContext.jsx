import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'
import * as cartApi from '../api/cart'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i._id === action.payload._id && i.size === action.payload.size
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id && i.size === action.payload.size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i._id === action.payload._id && i.size === action.payload.size)
        ),
      }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload._id && i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { items: [] }
    case 'LOAD_CART':
      return { items: action.payload }
    default:
      return state
  }
}

const fromServerItem = (item) => ({
  _id: item.productId,
  name: item.name,
  slug: item.slug,
  images: item.image ? [item.image] : [],
  price: item.price,
  size: item.size,
  quantity: item.quantity,
  availableStock: item.availableStock,
  stockIssue: item.stockIssue,
})

const fromServerCart = (cartResponse) => (cartResponse?.items || []).map(fromServerItem)

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const bootstrappedRef = useRef(false)
  const prevUserRef = useRef(null)

  const loadGuestCartFromStorage = useCallback(() => {
    const saved = localStorage.getItem('bindass_cart')
    dispatch({ type: 'LOAD_CART', payload: saved ? JSON.parse(saved) : [] })
  }, [])

  const loadServerCart = useCallback(async () => {
    try {
      const { data } = await cartApi.getCart()
      dispatch({ type: 'LOAD_CART', payload: fromServerCart(data.data) })
    } catch {
      dispatch({ type: 'LOAD_CART', payload: [] })
    }
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true
      prevUserRef.current = user
      if (user) {
        loadServerCart()
      } else {
        loadGuestCartFromStorage()
      }
      return
    }

    const justLoggedIn = !prevUserRef.current && user
    const justLoggedOut = prevUserRef.current && !user

    if (justLoggedIn) {
      const guestItems = state.items.map(i => ({
        productId: i._id,
        size: i.size,
        quantity: i.quantity,
      }))
      cartApi.mergeGuestCart({ items: guestItems })
        .then(({ data }) => {
          dispatch({ type: 'LOAD_CART', payload: fromServerCart(data.data) })
          localStorage.removeItem('bindass_cart')
        })
        .catch(() => loadServerCart())
    } else if (justLoggedOut) {
      loadGuestCartFromStorage()
    }

    prevUserRef.current = user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  useEffect(() => {
    if (!user) {
      localStorage.setItem('bindass_cart', JSON.stringify(state.items))
    }
  }, [state.items, user])

  const addToCart = async (product, size) => {
    if (user) {
      try {
        const { data } = await cartApi.addCartItem({
          productId: product._id,
          size,
          quantity: 1,
        })
        dispatch({ type: 'LOAD_CART', payload: fromServerCart(data.data) })
        toast.success(`${product.name} added to cart`)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not add item to cart')
      }
      return
    }
    dispatch({ type: 'ADD_ITEM', payload: { ...product, size } })
    toast.success(`${product.name} added to cart`)
  }

  const removeFromCart = async (id, size) => {
    if (user) {
      try {
        const { data } = await cartApi.removeCartItem(id, size)
        dispatch({ type: 'LOAD_CART', payload: fromServerCart(data.data) })
      } catch {
        toast.error('Could not remove item')
      }
      return
    }
    dispatch({ type: 'REMOVE_ITEM', payload: { _id: id, size } })
  }

  const updateQuantity = async (id, size, quantity) => {
    if (quantity < 1) return removeFromCart(id, size)
    if (user) {
      try {
        const { data } = await cartApi.updateCartItem({ productId: id, size, quantity })
        dispatch({ type: 'LOAD_CART', payload: fromServerCart(data.data) })
      } catch {
        toast.error('Could not update quantity')
      }
      return
    }
    dispatch({ type: 'UPDATE_QTY', payload: { _id: id, size, quantity } })
  }

  const clearCart = async () => {
    if (user) {
      try {
        await cartApi.clearCartApi()
      } catch {
        toast.error('Could not clear cart')
        return
      }
    }
    dispatch({ type: 'CLEAR_CART' })
  }

  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const hasStockIssue = state.items.some(i => i.stockIssue)

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      hasStockIssue,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)