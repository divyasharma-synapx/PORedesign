import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  isCartOpen: false
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productCode === action.payload.productCode);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productCode === action.payload.productCode
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.productCode !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.productCode === action.payload.productCode
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeItem = useCallback((productCode) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productCode });
  }, []);

  const updateQuantity = useCallback((productCode, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productCode, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = state.items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);

  const itemsBySupplier = state.items.reduce((groups, item) => {
    const key = item.supplierGroupCode || item.supplierCode;
    if (!groups[key]) {
      groups[key] = {
        supplierCode: key,
        supplierName: item.supplierName,
        location: item.location,
        items: []
      };
    }
    groups[key].items.push(item);
    return groups;
  }, {});

  return (
    <CartContext.Provider value={{
      items: state.items,
      totalItems,
      totalValue,
      itemsBySupplier,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
