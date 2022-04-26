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
      duration={!close ? 600000 : duration}
    >
      <ToastPrimitive.Title css={{ mr: close ? "$12" : 0 }}>
        {title}
      </ToastPrimitive.Title>
      {description && (
        <ToastPrimitive.Description css={{ mr: close ? "$12" : 0 }}>
          {description}
        </ToastPrimitive.Description>
      )}
      {close && <ToastPrimitive.Close />}
    </ToastPrimitive.Root>
  );
};
