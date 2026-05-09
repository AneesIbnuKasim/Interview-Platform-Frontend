import React, { memo, useEffect } from 'react'
import Navbar from './ui/NavBar.jsx'
import Footer from './ui/Footer.jsx'
import { useDispatch } from 'react-redux'
import { fetchCartThunk } from '../redux/slices/cartSlice'
import { useAuth } from '../context/AuthContext'
import { fetchWishlistThunk } from '../redux/slices/wishlistSlice'

const AppLayout = memo(({
    children
}) => {
    const dispatch = useDispatch()
    const { isAuthenticated, token, user } = useAuth()
    useEffect(() => {
      if (token) {
        dispatch(fetchCartThunk())
      }
    }, [token, dispatch])

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlistThunk())
    }
  }, [dispatch]);

  //APPLY THEME ON LOAD
  useEffect(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);
  return (
    <div>
      <Navbar/>
      <div>
        {children}
      </div>
      <Footer/>
    </div>
  )
})

export default AppLayout
