import {
  useHMSActions,
  useHMSStore,
  selectLocalPeer,
} from "@100mslive/hms-video-react";
import { getMetadata } from "../../common/utils";

export const useMetadata = () => {
  const hmsActions = useHMSActions();
  const peer = useHMSStore(selectLocalPeer);
  const isHandRaised =
    getMetadata(peer?.customerDescription)?.isHandRaised || false;
  /**
   * @param isHandRaised {boolean}
   */
  const setIsHandRaised = async isHandRaised => {
    if (typeof isHandRaised !== "boolean")
      throw new Error("setIsHandRaised only accepts a boolean value");
    await hmsActions.updatePeer({
      metadata: JSON.stringify({ isHandRaised: isHandRaised }),
    });
  };
  return { isHandRaised: isHandRaised, setIsHandRaised: setIsHandRaised };
};
