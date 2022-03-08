import React from "react";
import { Toast as ToastPrimitive } from "@100mslive/react-ui";

export const Toast = ({
  title,
  description,
  close = true,
  open,
  duration,
  onOpenChange,
}) => {
  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
    >
      <ToastPrimitive.Title>{title}</ToastPrimitive.Title>
      {description && (
        <ToastPrimitive.Description>{description}</ToastPrimitive.Description>
      )}
      {close && <ToastPrimitive.Close />}
    </ToastPrimitive.Root>
  );
};
