import React from "react";

const AdminHeader = ({ 
  title, 
  user, 
  stats, 
  connected, 
  onRefresh,
  children 
}) => {

  return (
    <div className="bg-white flex justify-between items-center p-5 rounded-tr-xl h-20 w-full shadow-xl backdrop-blur-md bg-opacity-70 transition hover:-translate-y-1 hover:shadow-2xl">
          <div>
            <h2
              className="text-3xl ml-14 lg:ml-0 font-bold mb-1 bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
            >
              {title}
            </h2>
          </div>

          {/* Right Controls */}
          <div>
            {children}
          </div>
    </div>
  );
};

export default AdminHeader;