import React, { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className = '', ...rest }, ref) => {
  return (
    <button
      ref={ref}
      {...rest}
      className={`text-white px-4 py-2 rounded-2xl transition-shadow shadow-md ${className}`}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
