import { Logo } from "@/components/shared/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo showTagline />
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
