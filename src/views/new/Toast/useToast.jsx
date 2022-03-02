import { useEffect, useState } from "react";
import { ToastManager } from "./ToastManager";

export const useToast = () => {
  const [toasts, setToast] = useState([]);
  useEffect(() => {
    ToastManager.addListener(setToast);
    return () => {
      ToastManager.removeListener(setToast);
    };
  }, []);
  return { toasts };
};
