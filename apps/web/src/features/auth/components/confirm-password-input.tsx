import * as React from "react";
import { PasswordInput, type PasswordInputProps } from "./password-input";

export const ConfirmPasswordInput = React.forwardRef<HTMLInputElement, Omit<PasswordInputProps, "label">>(
  ({ id = "confirmPassword", ...props }, ref) => {
    return (
      <PasswordInput
        ref={ref}
        id={id}
        label="Confirm Password"
        placeholder="••••••••"
        required
        {...props}
      />
    );
  }
);
ConfirmPasswordInput.displayName = "ConfirmPasswordInput";
