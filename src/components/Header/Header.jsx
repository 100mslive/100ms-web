import React from "react";
import { ConferencingHeader } from "./ConferencingHeader";
import { StreamingHeader } from "./StreamingHeader";
import { isStreamingKit } from "../../common/utils";

export const Header = () => {
  return isStreamingKit() ? <StreamingHeader /> : <ConferencingHeader />;
};
