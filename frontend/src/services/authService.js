import ResetPassword from '../pages/ResetPassword'
import { makeRequest } from '../utils/apiClient'

export const authAPI = {
    register: async(userData)=>{
        return makeRequest({
            method: 'post',
            url: '/api/auth/register',
            data: userData
        })
    },

    login: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/auth/login',
            data: credentials
        })
    },

    forgetPassword: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/auth/forgot-password',
            data: credentials
        })
    },

    verifyOtp: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/auth/verify-otp',
            data: credentials
        })
    },

    resetPassword: (credentials)=>{
        return makeRequest({
            method: 'put',
            url: 'api/auth/reset-password',
            data: credentials
        })
    },

}