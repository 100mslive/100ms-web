import React from "react";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { Toast as ToastPrimitive } from "@100mslive/react-ui";
import { Toast } from "./Toast";
import { useToast } from "./useToast";
import { MAX_TOASTS } from "../../../common/constants";

export const ToastManager = () => {
  const { toasts, removeToast } = useToast();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  return (
    <ToastPrimitive.Provider>
      {toasts.slice(0, MAX_TOASTS).map(toast => {
        return (
          <Toast
            key={toast.id}
            {...toast}
            onOpenChange={value => !value && removeToast(toast.id)}
          />
        );
      })}
      <ToastPrimitive.Viewport css={!isConnected ? {} : { bottom: "$24" }} />
    </ToastPrimitive.Provider>
  );
};
