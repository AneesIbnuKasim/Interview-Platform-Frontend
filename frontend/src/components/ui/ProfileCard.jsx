import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b font-semibold ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`px-6 py-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-t ${className}`}>
      {children}
    </div>
  );
}