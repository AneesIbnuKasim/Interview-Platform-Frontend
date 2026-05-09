export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/',
  imageURL: import.meta.env.VITE_IMAGE_URL || 'http://localhost:5001/uploads/',
  imageURL2: import.meta.env.VITE_IMAGE_URL2 || 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const AUTH_CONFIG = {
  tokenKey: 'authToken',
  adminTokenKey: 'adminToken',
  userKey: 'user',
  adminKey: 'admin',
  resetTokenKey: 'ResetToken',
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes
}

export const SHIPPING = {
  freeShippingThreshold : 499,
  shippingFee : 40
}
export const COD_FEE = 10

export const RAZORPAY = {
  API: import.meta.env.VITE_RAZORPAY_API,
  KEY: import.meta.env.VITE_RAZORPAY_SECRET
}

export const ORDER_STATUS = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_INITIATED", "RETURNED"]

export const ACTIVE_STATUS = ["active", "inactive"]