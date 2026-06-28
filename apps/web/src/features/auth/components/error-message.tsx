import { Alert } from "@/components/ui/alert";

interface ErrorMessageProps {
  message?: string | null;
  title?: string;
  onClose?: () => void;
}

export function ErrorMessage({ message, title = "Error", onClose }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <Alert
      variant="error"
      title={title}
      description={message}
      onClose={onClose}
      className="w-full text-left"
    />
  );
}
