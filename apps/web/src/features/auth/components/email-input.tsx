import * as React from "react";
import { BrutalInput, type BrutalInputProps } from "@/components/ui/brutal-input";

export const EmailInput = React.forwardRef<HTMLInputElement, Omit<BrutalInputProps, "type" | "label">>(
  ({ id = "email", ...props }, ref) => {
    return (
      <BrutalInput
        ref={ref}
        id={id}
        type="email"
        label="Email Address"
        placeholder="name@example.com"
        autoComplete="email"
        required
        {...props}
      />
    );
  }
);
EmailInput.displayName = "EmailInput";
