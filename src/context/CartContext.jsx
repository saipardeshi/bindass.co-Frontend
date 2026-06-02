import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

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

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bindass_cart')
    if (saved) dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
  }, [])

  useEffect(() => {
    localStorage.setItem('bindass_cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product, size) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, size } })
    toast.success(`${product.name} added to cart`)
  }

  const removeFromCart = (id, size) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { _id: id, size } })
  }

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return removeFromCart(id, size)
    dispatch({ type: 'UPDATE_QTY', payload: { _id: id, size, quantity } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)