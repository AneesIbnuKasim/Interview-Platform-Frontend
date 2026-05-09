import React, { memo } from "react";
import { Link } from "react-router-dom";
import { GRADIENTS } from "../../constants/ui";

const AuthLayout = memo(({
  children,
  title,
  subtitle,
  leftContent,
  icon,
  rightContent,
  showLogo = true,
  className = "",
  page = 'loginPage'
}) => {
  const defaultLeftContent = (
    <div className="text-center p-6 animate-slide-left">
      <div className="mb-6">
        <i className="bi bi-kanban text-6xl mb-4 block"></i>
        <h2 className="text-4xl font-bold mb-4">Welcome Back to Ventaro</h2>
        <p className="text-lg opacity-90">
          Where quality finds You
        </p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen flex flex-col ${GRADIENTS.primary}  ${className}`}>

    <div className=" flex flex-col lg:flex-row m-auto">
          {/* LEFT SIDE */}
      <div className="hidden lg:flex w-full lg:w-6/12 items-center">
        <div className={`relative w-142.5 ${page === 'loginPage' ? 'h-[75%]' : 'h-[85%]'} rounded-[20px_0px_0px_20px]  ${GRADIENTS.secondary.light}`}>
         {leftContent}
        </div>
      </div>


      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-6/12 items-center min-h-screen justify-items-start">
        <div className={`w-full p-5  lg:px-15 lg:py-10 sm:min-w-117.5 rounded-[20px] mx-5 md:mx-0 my-13 lg:rounded-[0px_20px_20px_0px] bg-white h-${ page==='loginPage' ? '[75%]' : '[85%]' } `}>
          <div className="animate-slide-right delay-100">
            {showLogo && (
              <div className="text-center items-center mb-8">
                <Link to="/" >
                <img className="inline-block w-15" src="/LOGO.svg" alt="logo" />
                </Link>
                {title && <h3 className=" h2 mb-2 text-black">{title}</h3>}
                {subtitle && <p className="text-muted">{subtitle}</p>}
              </div>
            )}
            {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
)

export default AuthLayout;