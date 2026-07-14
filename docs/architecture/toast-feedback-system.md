# Toast & Feedback System Architecture

## Overview
The AI Career Agent application uses a unified, accessible feedback system across all modules to ensure consistent user experience. This system replaces inconsistent native `window.confirm()` dialogs and scattered toast state management with centralized components based on Radix UI and Sonner.

## Core Components

### 1. The Toaster (`components/ui/toaster.tsx`)
- **Technology**: `sonner`
- **Purpose**: Global, non-blocking feedback for success, error, info, and warning events.
- **Design**: Implements the `brutal-shadow` design language.
- **Usage**:
  ```tsx
  import { toast } from "sonner";
  toast.success("Profile saved successfully!");
  ```

### 2. The Confirmation Dialog (`components/ui/confirm-dialog.tsx`)
- **Technology**: Radix UI Dialog + Framer Motion
- **Purpose**: Blocking feedback for destructive actions or important confirmations.
- **Hook**: `useConfirm` provides a programmatic way to await user confirmation without managing open/close state manually.
- **Usage**:
  ```tsx
  const { confirm, ConfirmationDialog } = useConfirm();
  
  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Item",
      description: "Are you sure?",
      isDestructive: true
    });
    if (isConfirmed) doDelete();
  };
  
  return (
    <div>
      <button onClick={handleDelete}>Delete</button>
      <ConfirmationDialog />
    </div>
  );
  ```

## Accessibility (A11y)
- **Toasts**: Automatically managed by Sonner (ARIA live regions).
- **Forms**: Inline validation uses `role="alert"` and `aria-invalid` (e.g., `BrutalInput`, `BrutalSelect`).
- **Dialogs**: Radix UI manages focus trapping, screen reader announcements, and keyboard navigation.

## Best Practices
- **Do NOT** use `window.confirm` or `window.alert`.
- **Do NOT** manage toast visibility with local component state.
- **ALWAYS** include `<ConfirmationDialog />` in the component tree when using `useConfirm`.
