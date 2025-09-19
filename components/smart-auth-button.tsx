"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

interface SmartAuthButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  asChild?: boolean;
}

export function SmartAuthButton({ children, ...props }: SmartAuthButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <Button 
      {...props} 
      onClick={handleClick}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? 'Loading...' : children}
    </Button>
  );
}
