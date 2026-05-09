import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, ToggleLeft, ToggleRight } from "lucide-react";
import { useProduct } from "../../context/ProductContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { useNavigateWithReset } from "../../hooks/useNavigateWithReset";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { fetchWishlistThunk, resetWishlist } from "../../redux/slices/wishlistSlice";
import { toggleTheme } from "../../redux/slices/themeSlice";
import { resetCart } from "../../redux/slices/cartSlice";
import { GRADIENTS } from "../../constants/ui";

export default function Navbar({
  logo = "Ventaro",
  showProfile = true,
  showWishlist = true,
  showBag = true,
}) {
  const navigate = useNavigate();
  const navigateWithReset = useNavigateWithReset();
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch()

  const [menuOpen, setMenuOpen] = useState(false);
  const { filters, setFilters, allCategories, setGlobalCategory, fetchProduct } = useProduct();

    const { items: wishlist, loading } = useSelector(
      (state) => state.wishlist
    );

    const { mode } = useSelector(state => state.theme)

  const { logout, user, isAuthenticated } = useAuth();
  const categories = allCategories?.slice(1,5)
  categories?.unshift('Home')
  // categories?.pull('Air conditioner')

  useEffect(() => {
    if ( allCategories?.length === 0 || !allCategories) {
      fetchProduct()
    }
  }, [allCategories])


  useEffect(() => {
    if (!items && user ) {
      fetchWishlistThunk()
    }
  }, [items])

  //NAVIGATE TO CORRESPONDING CATEGORY WHEN CLICKS
  const navigateToCategory = (cat) => {
    setGlobalCategory(cat);
    cat === 'Home' ? navigate(`/`) : navigateWithReset(`/products/${cat}`)
    ;
  };

  //HANDLE LOGOUT
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    dispatch(resetCart());
  dispatch(resetWishlist());
  }

  return (
    <>
      <nav className="w-full shadow-lg sticky top-0 z-50 bg-card">
        <div className={`max-w-360 mx-auto px-4 h-18 flex items-center justify-between gap-4 `}>
          {/* LEFT: Mobile menu + Logo */}
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMenuOpen(true)}>
              <Menu size={26} />
            </button>

            <div className="flex items-center gap-2 cursor-pointer">
              <img width={40} className="hidden sm:block" src="/LOGO.svg" alt="logo" onClick={()=>navigate('/')} />

              <span className="font-semibold text-lg hidden sm:block" onClick={()=>navigate('/')}>
                {logo}
              </span>
            </div>
          </div>

          {/* CENTER: categories + search */}
          <div className="flex-1 flex items-center gap-10 justify-center">
            {/* Categories (dynamic) */}
            <ul className="hidden lg:flex items-center gap-8 text-sm font-semibold">
              {categories?.map((cat) => (
                <li
                  key={cat}
                  className="cursor-pointer menu-text"
                  onClick={() => navigateToCategory(cat)}
                >
                  {cat.toUpperCase()}
                </li>
              ))}
            </ul>

            {/* Search input */}
            <SearchInput />
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-5">
              {/* THEME ICON */}
            {
              mode === 'light' ? (
                <ToggleLeft size={22} className={`cursor-pointer`} onClick={() => dispatch(toggleTheme())} />
              ) :
              <ToggleRight size={22} className={`cursor-pointer text-red-500`} onClick={() => dispatch(toggleTheme())} />
            }
              
            <div className="relative group inline-block">
              {showProfile && (
                <User
                  onClick={() => navigateWithReset(`/profile/account`)}
                  size={22}
                  className="cursor-pointer"
                />
              )}
             {
              isAuthenticated && (
                 <div className="absolute hidden w-25 text-center group-hover:block bg-violet-300 top-4 right-1 rounded z-100">
                <NavLink className="flex flex-col w-full ">
                  <Link
                    to={"/profile/account"}
                    className="hover:bg-violet-400 rounded p-1 "
                  >
                    Profile
                  </Link>
                  <Link
                    to="/"
                    className="hover:bg-violet-400 rounded p-1 "
                    onClick={(e) => {
                      handleLogout(e)
                    }}
                  >
                    Logout
                  </Link>
                </NavLink>
              </div>
              )
             }
            </div>
            {showWishlist && (
              <div className="relative">
                <Heart size={22} className={`cursor-pointer text-${wishlist.length>0 ? 'red-500' : ''}`} onClick={() => navigate("/wishlist", { replace: true })} />
                  {wishlist.length > 0 && (
                  <span className="absolute flex rounded-xl text-xs bottom-4 left-3  text-white bg-red-600 w-4 h-4 justify-center items-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
            )
              
              }
            {showBag && (
              <div className="relative">
                <ShoppingBag
                  size={22}
                  className="cursor-pointer"
                  onClick={() => navigate("/cart", { replace: true })}
                />
                {items.length > 0 && (
                  <span className="absolute flex rounded-xl text-xs bottom-3 left-3  text-white bg-red-600 w-4 h-4 justify-center items-center">
                    {items.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-card shadow-lg z-50 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setMenuOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <ul className="flex flex-col gap-6 p-6 text-base font-medium">
          {categories?.map((cat) => (
            <li key={cat} className="cursor-pointer" onClick={() => {
              navigateToCategory(cat)
              setMenuOpen(false)
            }}>
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
}
