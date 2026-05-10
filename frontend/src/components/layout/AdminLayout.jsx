import React, { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminWrapper from "./ui/AdminWrapper.jsx";
import { AdminHeader, UserAvatar } from "./ui";
import { AdminSidebar } from "./ui/AdminSidebar.jsx";
import { useAdmin } from "../context/AdminContext";



const AdminLayout = React.memo(({ 
 }) => {
  
  const { admin, logout, getProfile } = useAdmin();
  const user = admin
  const location = useLocation();
  const titleName = location.pathname.split('/')
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => {
    setTitle(titleName[2].toUpperCase())
  }, [location])

  const adminData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
        if (!admin?.id && adminData?.id) {
          getProfile(adminData.id);
        }
      }, [admin?.id]);

  const handleLogout = useCallback(() => {
    setTimeout(() => {
      logout()
    }, 500)
    navigate("/admin/login")
  }, [logout, navigate])

  return (
    <>
        <AdminWrapper>
            <div className="lg:m-10 flex text-black  rounded-xl min-h-screen bg-gray-100">
                <AdminSidebar/>
                <div className="w-full">
                    <AdminHeader
                title = {title}
                >
                <UserAvatar
                user={admin}
                showName= {true}
                showEmail={true}
                size="sm"
                onclick={handleLogout}
                />
                </AdminHeader>
                <div className="m-5" >
                  <Outlet  />
                </div>
                </div>
                
            </div>
        
        </AdminWrapper>
        
    </>
  )
});

export default AdminLayout;
