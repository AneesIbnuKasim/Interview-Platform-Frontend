// Used for forget email, reset otp box...

import { Children, memo } from "react";
import { GRADIENTS } from "../../constants/ui";
import AdminWrapper from "./AdminWrapper";

export const AuthInnerBox = memo(({
    title= 'Forgot your password',
    subtitle= '',
    content= '',
    textPosition= 'center',
    children
})=>{
    return (
        <>
        <AdminWrapper>
            <div className="flex justify-center w-full min-h-screen items-center">

            <div className={`relative flex flex-col gap-5 mx-5 sm:min-w-[600px] shadow items-center shadow-secondary min-h-[400px] p-8 rounded-[10px] text-${textPosition}  ${GRADIENTS.secondary.light}`}>

                <>
                    <img className='absolute bottom-0 right-30 w-15' src="./Ellipse_1.svg" alt="ellipse" />
                    <img className='absolute bottom-40 right-10  w-12' src="./Ellipse_1.svg" alt="ellipse" />
                    <img className='absolute top-0 right-10 w-14' src="./Ellipse_5.svg" alt="ellipse" />
                    <img className='absolute bottom-10 left-20 w-20' src="./Ellipse_6.svg" alt="ellipse" />
                    <img className='absolute top-30 left-40 w-15' src="./Ellipse_6.svg" alt="ellipse" />
                </>

              <div className="max-w-md text-center mt-5 z-10">
                {title && 
              <h3 className='h2 mb-2'>
                {title} 
              </h3>
              }
              {subtitle && <p className="helper">{subtitle}</p>}
              </div>
              {content && 
              <div className={`w-[90%] sm:w-[70%] z-1 mt-${subtitle === '' ? 0 : 10}`}>
                {content}
                {children}
              </div>}
            </div>

          </div>
        </AdminWrapper>
        </>
    )
})