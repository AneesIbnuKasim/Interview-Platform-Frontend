import { NavLink } from "./NavLink";
import {
  FiLayout,
  FiUsers,
  FiShoppingCart,
  FiCreditCard,
  FiStar,
  FiBell,
  FiSettings,
  FiUserCheck,
  FiMenu,
  FiX,
  FiChevronDown,
  FiBox,
} from "react-icons/fi";

import { useState } from "react";
import Button from "./Button";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: FiLayout, label: "Dashboard", path: "/admin/dashboard" },
  { icon: FiUsers, label: "Users", path: "/admin/users" },
  { icon: FiBox, label: "Products", path: "products" },
  { icon: FiShoppingCart, label: "Orders", path: "orders" },
  { icon: FiStar, label: "Categories", path: "categories" },
  { icon: FiBell, label: "Coupons", path: "coupons" },
  { icon: FiSettings, label: "Banners", path: "banners" },
  { icon: FiUserCheck, label: "Sales Report", path: "sales-report" },
  { icon: FiCreditCard, label: "Profile", path: "profile" },
];

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("Products");
  const location = useLocation();

  return (
    <div className="rounded">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
           z-40 h-screen lg:block ${isOpen ? 'fixed' : 'hidden'} lg:w-64 
          bg-gradient-to-b from-secondary/100 to-secondary/70 
          lg:from-secondary/0 lg:to-secondary/20 
          shadow-xl shadow-xl text-black
          transition-transform duration-300 ease-in-out
          sticky top-0
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-4 shadow-lg border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-center w-12 h-12 ">
              { !isOpen && 
              <Link to="/" >
                <img className="inline-block w-12" src="/LOGO.svg" alt="logo" />
                </Link>
              }
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Ventaro</h1>
              <p className="text-xs text-muted-foreground font-medium">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-hidden hover:overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedMenu(
                            expandedMenu === item.label ? null : item.label
                          )
                        }
                        className={`
                          flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg
                          text-muted-foreground hover:bg-secondary/80 hover:text-secondary-foreground
                          transition-all duration-200 font-medium
                          
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span>{item.label}</span>
                        </div>

                        <FiChevronDown
                          className={`
                            h-4 w-4 transition-transform duration-200
                            ${
                              expandedMenu === item.label
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />
                      </button>

                      {expandedMenu === item.label && (
                        <ul className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.path}>
                              <NavLink
                                to={subItem.path}
                                className="
                                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                                  text-muted-foreground hover:bg-secondary/60 hover:text-secondary-foreground
                                  transition-all duration-200
                                "
                                activeClassName="
                                  bg-gradient-to-r from-primary to-accent
                                  text-primary-foreground shadow-md font-semibold
                                "
                                onClick={() => setIsOpen(false)}
                              >
                                <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                <span>{subItem.label}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        text-muted-foreground hover:bg-secondary/80 hover:text-secondary-foreground
                        transition-all duration-200 font-medium
                      "
                      activeClassName="
                        bg-gradient-to-r from-primary to-accent
                        text-primary-foreground shadow-md font-semibold
                      "
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
};