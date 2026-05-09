import { API_CONFIG } from "../config/app";
import ResetPassword from "../pages/ResetPassword";
import { makeRequest } from "../utils/apiClient";
import axios from "axios";

export const userAPI = {
  //USER PROFILE SECTION
  updateProfile: (editData) => {
    return makeRequest({
      method: "put",
      url: "api/user/profile",
      data: editData,
    });
  },

  //GET PROFILE DETAILS
  getProfile: (editData) => {
    return makeRequest({
      method: "get",
      url: "api/user/me",
    });
  },

  //UPDATE USER PROFILE AVATAR
  updateAvatar: async (formData) => {
    const token = localStorage.getItem("authToken");
    const res = await axios.put(
      `${API_CONFIG.baseURL}/api/user/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },

  // ADD ADDRESS ID TO USER AND ADDRESS TO ADDRESS SCHEMA
  addAddress: (addressData) => {
    return makeRequest({
      method: "post",
      url: "api/user/addresses",
      data: addressData,
    });
  },

  // UPDATE ADDRESS
  editAddress: (addressId, addressData) => {

    return makeRequest({
      method: "put",
      url: `api/user/addresses/${addressId}`,
      data: addressData,
    });
  },

  // DELETE ADDRESS
  deleteAddress: (addressId) => {
    return makeRequest({
      method: "delete",
      url: `api/user/addresses/${addressId}`,
    });
  },

  //CHANGE PASSWORD FROM USER PROFILE
  changePassword: (credentials) => {
    return makeRequest({
      method: "put",
      url: "api/user/change-password",
      data: credentials,
    });
  },

  //FETCH WALLET
  fetchWallet: (credentials) => {
    return makeRequest({
      method: "get",
      url: "api/user/wallet",
      data: credentials,
    });
  },
};
