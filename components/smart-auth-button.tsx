"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";

interface SmartAuthButtonProps extends ButtonProps {
  children: React.ReactNode;
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
