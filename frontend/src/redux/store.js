import { configureStore } from "@reduxjs/toolkit";
import { cartPersistenceMiddleware } from "./middleware/addToLocalStorage";
import { cartSyncMiddleware } from "./middleware/cartSyncMiddleware";
import cartReducer from './slices/cartSlice'
import couponReducer from './slices/couponSlice'
import checkoutReducer from './slices/checkoutSlice'
import orderReducer from './slices/orderSlice'
import salesReducer from './slices/salesSlice'
import chatReducer from './slices/chatSlice'
import bannerReducer from './slices/bannerSlice'
import wishlistReducer from './slices/wishlistSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    coupon: couponReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    sales: salesReducer,
    chat: chatReducer,
    banner: bannerReducer,
    wishlist: wishlistReducer,
    theme: themeReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      cartPersistenceMiddleware,
      cartSyncMiddleware
    ),
})