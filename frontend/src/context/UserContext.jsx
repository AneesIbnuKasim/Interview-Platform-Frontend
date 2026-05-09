import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  getAdminToken,
  getAuthToken,
  getUser,
  setUser,
} from "../utils/apiClient";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminService";
import { userAPI } from "../services/userService";

const UserContext = createContext();

const initialState = {
  user: {},
  token: getAuthToken(),
  isAuthenticated: !!getUser(),
  loading: false,
  wallet_loading: false,
  error: null,
};

const USER_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  SET_ERROR: "SET_ERROR",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_USER: "SET_USER",
  UPDATE_USER: "UPDATE_USER",
  UPDATE_AVATAR: "UPDATE_AVATAR",
  DELETE_ADDRESS: "DELETE_ADDRESS",
  WALLET_LOADING: "WALLET_LOADING"
};

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case USER_ACTIONS.WALLET_LOADING:
      return { ...state, wallet_loading: action.payload, error: null };

    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case USER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null, loading: false };

    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user || action.payload,
        loading: false,
      };

    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false
      };

    case USER_ACTIONS.DELETE_ADDRESS:
      return {
        ...state,
        user: { ...state.user, addresses: state.user.addresses.filter(address => address._id !== action.payload ) },
        loading: false
      }

    case USER_ACTIONS.UPDATE_AVATAR:
      return {
        ...state,
        user: {
          ...state.user,
          avatar: action.payload,
        },
      };

    default : 
    return state
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const { user, isAuthenticated, loading, token, error, wallet_loading } = state;

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
    }
  }, [state.error]);

  const getProfile = useCallback(async (id) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const response = await userAPI.getProfile(id);

      dispatch({
        type: USER_ACTIONS.SET_USER,
        payload: {
          user: response.data.user,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });

      return { success: false, error: errorMessage };
    }
  }, []);

  //UPDATE USER PROFILE

  const updateProfile = useCallback(async (userData) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const response = await userAPI.updateProfile(userData);

      dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: response.data.user });
      toast.success(response.message);

      return { success: true };
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  }, []);

  //UPDATE USER AVATAR 
  const updateAvatar = useCallback(async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await userAPI.updateAvatar(formData);

    dispatch({
      type: USER_ACTIONS.UPDATE_AVATAR,
      payload: res.data.avatar,
    });

    toast.success("Avatar updated");

    return { success: true };
  } catch (error) {
     dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
  }
}, []);

//ADD ADDRESS TO ADDRESS COLLECTION
const addAddress = useCallback(async(addressData) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true })
    try {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true})

        const response = await userAPI.addAddress(addressData)

        await getProfile()

        dispatch({type: USER_ACTIONS.UPDATE_USER, payload: response.data.address})

        toast.success(response.message)

        return { success: true }
    } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
    }
}, [])

//EDIT ADDRESS INFO
const editAddress = useCallback(async(addressId, addressData) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true })
    try {
        const response = await userAPI.editAddress(addressId, addressData)

        await getProfile()

        dispatch({type: USER_ACTIONS.UPDATE_USER, payload: response.data.address})
        
        toast.success(response.message)
        
        return { success: true }
    } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
    }
}, [])

//DELETE ADDRESS
const deleteAddress = useCallback(async(addressId) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true })
    try {
        const response = await userAPI.deleteAddress(addressId)

        console.log('delete response:',response)
        

        dispatch({type: USER_ACTIONS.DELETE_ADDRESS, payload: addressId})
        
        toast.success(response.message)

        return { success: true }
    } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
    }
}, [])


//CHANGE PASSWORD
const changePassword = useCallback(async(passwordData) => {
    try {
        const response = await userAPI.changePassword(passwordData)

        toast.success(response.message)

        return { success: true }
    } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
    }
}, [])

//FETCH WALLET
    const fetchWallet = useCallback(async() => {
        try {
          dispatch({ type: USER_ACTIONS.WALLET_LOADING, payload: true})
        const res = await userAPI.fetchWallet()
        
        dispatch({ type: USER_ACTIONS.WALLET_LOADING, payload: false})

        return res.data.wallet
        } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
        }
}, [])

  const values = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      getProfile,
      updateProfile,
      updateAvatar,
      addAddress,
      editAddress,
      deleteAddress,
      changePassword,
      fetchWallet,
      wallet_loading
    }),
    [user, loading, isAuthenticated, getProfile, updateProfile, addAddress, editAddress, changePassword, fetchWallet, wallet_loading]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
