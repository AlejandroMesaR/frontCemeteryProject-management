import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
        className 
      )}
      {...props}
    />
  );
};
