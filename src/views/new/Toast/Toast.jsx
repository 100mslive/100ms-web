import React from "react";
import { Toast as ToastUI } from "@100mslive/react-ui";

export const Toast = ({
  title,
  description,
  close = true,
  open,
  onOpenChange,
  css,
}) => {
  return (
    <ToastUI.Root open={open} onOpenChange={onOpenChange} css={css}>
      <ToastUI.Title>{title}</ToastUI.Title>
      {description && <ToastUI.Description>{description}</ToastUI.Description>}
      {close && <ToastUI.Close />}
    </ToastUI.Root>
  );
};
