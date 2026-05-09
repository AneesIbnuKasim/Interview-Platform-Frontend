import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";

const NavLink = forwardRef(({
  className = "",
  activeClassName = "",
  pendingClassName = "",
  to,
  ...props
}, ref) => {

  return (
    <RouterNavLink
      ref={ref}
      to={to}
      className={({ isActive, isPending }) => {
        let finalClasses = className;

        if (isActive && activeClassName) {
          finalClasses += ` ${activeClassName}`;
        }

        if (isPending && pendingClassName) {
          finalClasses += ` ${pendingClassName}`;
        }

        return finalClasses.trim();
      }}
      {...props}
    />
  );
});

NavLink.displayName = "NavLink";

export { NavLink };