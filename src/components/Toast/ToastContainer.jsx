import React, { useEffect, useState } from "react";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { Toast as ToastPrimitive } from "@100mslive/react-ui";
import { Toast } from "./Toast";
import { ToastManager } from "./ToastManager";
import { MAX_TOASTS } from "../../common/constants";

export const ToastContainer = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const [toasts, setToast] = useState([]);
  useEffect(() => {
    ToastManager.addListener(setToast);
    return () => {
      ToastManager.removeListener(setToast);
    };
  }, []);
  return (
    <ToastPrimitive.Provider swipeDirection="left" duration={3000}>
      {toasts.slice(0, MAX_TOASTS).map(toast => {
        return (
          <Toast
            key={toast.id}
            {...toast}
            onOpenChange={value => !value && ToastManager.removeToast(toast.id)}
          />
        );
      })}
      <ToastPrimitive.Viewport css={!isConnected ? {} : { bottom: "$24" }} />
    </ToastPrimitive.Provider>
  );
};
