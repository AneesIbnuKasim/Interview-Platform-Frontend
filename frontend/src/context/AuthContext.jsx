import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { clearTokens, getAuthToken, getUser, setUser } from "../utils/apiClient";
import { authAPI } from "../services";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetCart } from "../redux/slices/cartSlice";


const AuthContext = createContext()

const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
}

const authReducer = (state, action) => {
    switch(action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.SET_LOADING: return {
            ...state,
            loading: action.payload,
            error: null
        }

        case AUTH_ACTIONS.LOGIN_SUCCESS: return {
            ...state,
            user: action.payload,
            isAuthenticated: true,
            loading: false,
            error: null
        }

        case AUTH_ACTIONS.LOGOUT: return {
            ...state,
            isAuthenticated: false
        }
        case AUTH_ACTIONS.SET_ERROR: return {
            ...state,
            error: action.payload,
            loading: false,
            user: null,
            isAuthenticated: false
        }

        case AUTH_ACTIONS.CLEAR_ERROR: return {
            ...state,
            error: null,
        }

        default: return state
    }
}

const initialState = {
    user: getUser(),
    isAuthenticated: !!getUser(),
    loading: false,
    error: null
}

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState)
    const navigate = useNavigate()

    useEffect(()=>{
        if (state.user) {
            setUser(state.user)
        }
        else {
            setUser(null)
        }
    }, [state.user])

    const login = useCallback((userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: userData })
            return { success: true }
        } catch (error) {
            const errorMessage = error.message || 'Login failed'
            dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage })
            return { success: false, error: errorMessage}
        }
    }, [dispatch])

    const clearError = useCallback(()=>{
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
    },[])

    const logout = useCallback(() => {
        clearTokens()
        dispatch({ type: AUTH_ACTIONS.LOGOUT})

        setTimeout(() => {
            navigate('/', {replace: true})
            toast.success('Logged out successfully')
        }, 100)
    }, [dispatch])

    const value = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        token: getAuthToken(),
        login,
        logout,
        clearError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}