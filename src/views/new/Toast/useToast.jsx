import { useCallback, useEffect, useState } from "react";

export const useToast = () => {
  const [toasts, setToast] = useState([]);

  const addToast = useCallback(toast => {
    const id = Date.now();
    document.dispatchEvent(
      new CustomEvent("addToast", { detail: Object.assign(toast, { id: id }) })
    );
    return id;
  }, []);

  const removeToast = useCallback(id => {
    setToast(toasts => {
      const index = toasts.findIndex(toast => toast.id === id);
      if (index !== -1) {
        toasts.splice(index, 1);
      }
      return toasts;
    });
  }, []);

  useEffect(() => {
    const handleEvent = e => {
      const toast = e.detail;
      setToast(toasts => [...toasts, toast]);
    };
    document.addEventListener("addToast", handleEvent);
    return () => {
      document.removeEventListener("addToast", handleEvent);
    };
  }, []);

  return { toasts, removeToast, addToast };
};
