import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative rounded-lg border p-4 flex items-start space-x-4 shadow-md transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-500 border-gray-200",
        info: "bg-blue-50 text-blue-500 border-blue-100"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof alertVariants> & {
    timeout?: number;
    onClose?: () => void;
  }
>(({ className, variant, timeout, onClose, children, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (timeout) {
      timeoutId = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, timeout);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeout, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        alertVariants({ variant }), 
        "opacity-0 animate-slideIn", 
        className
      )}
      {...props}
    >
    <div className="flex-1">
      {children}
    </div>
    </div>
  )
});

Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("text-lg font-medium mb-1", className)}
    {...props}
  />
))

AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm opacity-80", className)}
    {...props}
  />
))

AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }