import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button, Loading } from "../components/ui";
import { useUser } from "../context/UserContext";
import formatImageUrl from "../utils/formatImageUrl";

const menuItems = [
  { label: "Account info", path: "account" },
  { label: "My orders", path: "orders" },
  { label: "My address", path: "address" },
  { label: "Change password", path: "password" },
  { label: "Wallet", path: "wallet" },
];

const ProfileLayout = () => {
  const { user, getProfile, updateProfile, updateAvatar, loading } = useUser();
  
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    
    const navigate = useNavigate()
    const location = useLocation()
  
    const userData = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
      if (!user?.id && userData?.id) {
        getProfile(userData.id);
      }
    }, [user?.id, userData?.id]);
  
    //HANDLE AVATAR PREVIEW WHEN SELECTED
    const handleAvatarSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    };
  
    // HANDLE SAVING AVATAR TO BACKEND
    const handleAvatarSave = async () => {
      if (!avatarFile) return;
  
      const res = await updateAvatar(avatarFile);
      if (res?.success) {
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    };
  
    //CANCELLING AVATAR CHANGE
    const handleAvatarCancel = () => {
      setAvatarFile(null);
      setAvatarPreview(null);
    };
  
    //CLEAN UP AVATAR PREVIEW
    useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);
  
    return (
      <div className="min-h-[70vh] bg-page flex flex-col">
        <div className="max-w-7xl w-full mx-auto p-3 sm:p-6">
          <div className="bg-card rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden">
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-slate-200 p-3 sm:p-6">
              {/* AVATAR PREVIEW AND EDIT SAVE SECTION */}
              <div className="flex flex-col items-center gap-5 mb-5">
                <div className="relative">
                  {user.avatar ? (
                    <img
                    src={
                      avatarPreview || formatImageUrl(user.avatar)
                    }
                    alt="avatar"
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-xl object-cover  cursor-pointer border border-gray-400"
                    onClick={() => document.getElementById("avatarInput").click()}
                  />
                  ) : (
                    <div className="bg-gray-300 animate-pulse w-20 h-20 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded border border-gray-400">

                    </div>
                  )}
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarSelect}
                  />
                </div>
                {/* AVATAR PREVIEW */}
                {avatarPreview && (
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      onClick={handleAvatarSave}
                      variant={'success'}
                      className="flex-1 sm:flex-none"
                    >
                      SAVE
                    </Button>
                    <button
                      onClick={handleAvatarCancel}
                      className="bg-gray-300 px-4 py-1 rounded-md flex-1 sm:flex-none"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>
              {/* NAVIGATION MENU SECTION */}
             <nav className="
  flex md:flex-col 
  gap-2 
  overflow-x-auto md:overflow-visible
  scrollbar-hide
">
  {menuItems.map(({ label, path }) => (
    <NavLink
      key={label}
      to={path}
      className={({ isActive }) => `
        shrink-0 md:w-full
        flex items-center justify-between
        px-4 py-2 sm:py-3
        rounded-lg
        text-sm sm:font-medium
        whitespace-nowrap
        ${
          isActive
            ? "bg-violet-600 text-white"
            : "hover:bg-gray-100 text-gray-700"
        }
      `}
    >
      {label}
      <ChevronRight className="w-4 hidden md:block" />
    </NavLink>
  ))}
</nav>
            </aside>
                  {/* RIGHT SECTION (DYNAMIC) */}
      <section className="flex-1 bg-card rounded-lg p-3 sm:p-6">
        {loading ? <Loading /> : <Outlet />}
      </section>
            
          </div>
        </div>
      </div>
    );
};

export default ProfileLayout;