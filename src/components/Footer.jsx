import React from "react";
import { ConferencingFooter } from "./Footer/ConferencingFooter";
import { StreamingFooter } from "./Footer/StreamingFooter";
import { isStreamingKit } from "../common/utils";

export const Footer = () => {
  return isStreamingKit() ? <StreamingFooter /> : <ConferencingFooter />;
};
