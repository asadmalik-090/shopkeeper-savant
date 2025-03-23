
import React, { useState, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";

/**
 * PriceInput component for monetary input with formatting
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Current numeric value
 * @param {Function} props.onChange - Function to update value
 * @param {string} [props.prefix] - Currency prefix
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Formatted price input
 * 
 * @example
 * const [price, setPrice] = useState(0);
 * 
 * <PriceInput value={price} onChange={setPrice} />
 */
const PriceInput = forwardRef(
  ({ value = 0, onChange, prefix = "Rs. ", className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Format the value with commas for display
    const formatValue = (val) => {
      return val === 0 ? "" : val.toLocaleString();
    };

    // Update the displayed value when the actual value changes
    useEffect(() => {
      setDisplayValue(formatValue(value));
    }, [value]);

    const handleFocus = (e) => {
      // Clear the field if it's 0
      if (value === 0) {
        setDisplayValue("");
      }
      props.onFocus?.(e);
    };

    const handleChange = (e) => {
      // Remove all non-numeric characters
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      
      // Convert to number or 0 if empty
      const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
      
      // Update the numeric value through the parent's onChange
      onChange(numericValue);
      
      // Update the display value with formatting
      setDisplayValue(rawValue === "" ? "" : numericValue.toLocaleString());
    };

    const handleBlur = (e) => {
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
          <span className="absolute left-3 text-muted-foreground font-medium">{prefix}</span>
        )}
        <Input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`pl-12 font-mono font-medium ${className}`}
          {...props}
        />
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";

export { PriceInput };
