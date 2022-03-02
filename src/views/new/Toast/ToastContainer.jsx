import React from "react";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { Toast as ToastPrimitive } from "@100mslive/react-ui";
import { Toast } from "./Toast";
import { useToast } from "./useToast";
import { MAX_TOASTS } from "../../../common/constants";
import { ToastManager } from "./ToastManager";

export const ToastContainer = () => {
  const { toasts } = useToast();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
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
