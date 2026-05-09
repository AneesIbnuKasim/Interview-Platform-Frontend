import React, { memo } from "react";
import { GRADIENTS } from "../../constants/ui";

const AdminWrapper = memo(({
  children,
  className= ''
}) => {

  return (
    <div className={` ${GRADIENTS.primary}  ${className}`}>

        <div className=" min-h-screen flex flex-col m-auto text-white">
          {children}
         </div>
    </div>
  )
})

export default AdminWrapper;