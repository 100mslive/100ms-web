import {
  useHMSActions,
  useHMSStore,
  selectLocalPeer,
  selectPeerMetadata,
} from "@100mslive/hms-video-react";

export const useMetadata = () => {
  const hmsActions = useHMSActions();
  const peer = useHMSStore(selectLocalPeer);
  const isHandRaised =
    useHMSStore(selectPeerMetadata(peer.id))?.isHandRaised || false;
  /**
   * @param isHandRaised {boolean}
   */
  const setIsHandRaised = async isHandRaised => {
    try {
      await hmsActions.changeMetadata({ isHandRaised: isHandRaised });
    } catch (error) {
      console.error("failed to set isHandRaised", error);
    }
  };
  return { isHandRaised: isHandRaised, setIsHandRaised: setIsHandRaised };
};
