import React from "react";
import { toast, ToastContainer, Slide, Zoom, Bounce } from "react-toastify";
import { Text } from "@100mslive/react-ui";
import { CrossIcon } from "@100mslive/react-icons";
import "./notifications.css";
import "react-toastify/dist/ReactToastify.css";

const defaultClasses = {
  root: `rounded-lg dark:bg-gray-100 bg-white p-5 flex items-center justify-between`,
  rootLeft: ``,
  rootCenter: `flex items-center dark:text-white text-black  space-x-4`,
  rootRight: `cursor-pointer`,
};

const Toast = ({ left, center, right }) => {
  return (
    <div className={defaultClasses.root}>
      <div className={defaultClasses.rootLeft}>{left}</div>
      <div className={defaultClasses.rootCenter}>{center}</div>
      <div className={defaultClasses.rootRight}>{right}</div>
    </div>
  );
};

const transitionMapping = {
  slide: Slide,
  bounce: Bounce,
  zoom: Zoom,
};

export const hmsToast = (message, options) => {
  const transition = options?.transitionType
    ? transitionMapping[options?.transitionType]
    : options?.toastProps?.transition || Bounce;

  const id = toast(
    <Toast
      left={options?.left || <Text variant="md">{message}</Text>}
      center={options?.center}
      right={options?.right || <CrossIcon />}
    />,
    {
      autoClose: options?.autoClose || 3000,
      ...options?.toastProps,
      transition,
    }
  );
  return { id, clearToast: () => toast.dismiss(id) };
};

export const HMSToastContainer = props => {
  return (
    <ToastContainer
      {...props}
      className="hms-toast"
      position={props.position || "bottom-left"}
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      limit={5}
    />
  );
};
