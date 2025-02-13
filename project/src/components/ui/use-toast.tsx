// src/components/ui/use-toast.tsx
import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  return { message, showToast };
}
