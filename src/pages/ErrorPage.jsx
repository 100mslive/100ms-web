import React from "react";
import errorBgDark from "../images/error-bg-dark.svg";
import errorBgLight from "../images/error-bg-light.svg";
import { useHMSTheme } from "@100mslive/hms-video-react";

function ErrorPage({ error }) {
  const theme = useHMSTheme().appBuilder.theme;
  return (
    <div
      className={`${
        theme === "dark" ? "text-white" : "text-black"
      } w-full h-full flex items-center justify-center`}
    >
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={theme === "dark" ? errorBgDark : errorBgLight}
          alt="error background"
        />
        <div className="absolute text-center top-1/3 left-1/2 z-10 transform -translate-y-1/2 -translate-x-1/2">
          <div className=" font-bold text-4xl">404</div>
          <div className="font-medium text-xl mt-7">{error}</div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
