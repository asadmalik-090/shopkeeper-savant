
import React, { useState, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";

export interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
}

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ value = 0, onChange, prefix = "Rs. ", className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Format the value with commas for display
    const formatValue = (val: number): string => {
      return val === 0 ? "" : val.toLocaleString();
    };

    // Update the displayed value when the actual value changes
    useEffect(() => {
      setDisplayValue(formatValue(value));
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Clear the field if it's 0
      if (value === 0) {
        setDisplayValue("");
      }
      props.onFocus?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove all non-numeric characters
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      
      // Convert to number or 0 if empty
      const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
      
      // Update the numeric value through the parent's onChange
      onChange(numericValue);
      
      // Update the display value with formatting
      setDisplayValue(rawValue === "" ? "" : numericValue.toLocaleString());
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // If left empty, reset to 0 with formatting
      if (displayValue === "") {
        setDisplayValue(formatValue(0));
        onChange(0);
      }
      props.onBlur?.(e);
    };

    return (
      <div className="relative flex items-center">
        {displayValue !== "" && (
          <span className="absolute left-3 text-muted-foreground">{prefix}</span>
        )}
        <Input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`pl-12 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";

export { PriceInput };
