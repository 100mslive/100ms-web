import React from "react";
import { Toast as ToastPrimitive } from "@100mslive/react-ui";

export const Toast = ({
  title,
  description,
  close = true,
  open,
  duration,
  onOpenChange,
  icon,
  ...props
}) => {
  return (
    <ToastPrimitive.HMSToast
      title={title}
      description={description}
      open={open}
      isClosable={close}
      onOpenChange={onOpenChange}
      duration={!close ? 600000 : duration}
      icon={icon}
      {...props}
    />
  );
};
