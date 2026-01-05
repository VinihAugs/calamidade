import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onIncrement, onDecrement, ...props }, ref) => {
    const handleIncrement = () => {
      if (onIncrement) {
        onIncrement();
      } else if (props.value !== undefined) {
        const currentValue = parseInt(String(props.value)) || 0;
        const min = props.min ? parseInt(String(props.min)) : undefined;
        const max = props.max ? parseInt(String(props.max)) : undefined;
        const newValue = currentValue + 1;
        if ((max === undefined || newValue <= max) && (min === undefined || newValue >= min)) {
          const event = {
            target: { value: String(newValue) },
          } as React.ChangeEvent<HTMLInputElement>;
          props.onChange?.(event);
        }
      }
    };

    const handleDecrement = () => {
      if (onDecrement) {
        onDecrement();
      } else if (props.value !== undefined) {
        const currentValue = parseInt(String(props.value)) || 0;
        const min = props.min ? parseInt(String(props.min)) : undefined;
        const max = props.max ? parseInt(String(props.max)) : undefined;
        const newValue = currentValue - 1;
        if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
          const event = {
            target: { value: String(newValue) },
          } as React.ChangeEvent<HTMLInputElement>;
          props.onChange?.(event);
        }
      }
    };

    return (
      <div className="number-input-wrapper relative">
        <Input
          type="number"
          ref={ref}
          className={cn("pr-10", className)}
          {...props}
        />
        <div className="number-input-spinner">
          <button
            type="button"
            onClick={handleIncrement}
            className="rounded-t-sm"
            aria-label="Incrementar"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="rounded-b-sm"
            aria-label="Decrementar"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };

