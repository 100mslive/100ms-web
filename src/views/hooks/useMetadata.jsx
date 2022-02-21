import {
  useHMSActions,
  useHMSStore,
  selectPeerMetadata,
  selectLocalPeerID,
} from "@100mslive/hms-video-react";

export const useMyMetadata = () => {
  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeerID);
  const metaData = useHMSStore(selectPeerMetadata(localPeerId));
  let isHandRaised = metaData?.isHandRaised || false;
  let isBRBOn = metaData?.isBRBOn || false; // BRB = be right back

  const update = async updatedFields => {
    try {
      await hmsActions.changeMetadata(Object.assign(metaData, updatedFields));
    } catch (error) {
      console.error("failed to update metadata ", metaData, updatedFields);
    }
  };

  const toggleHandRaise = async () => {
    isHandRaised = !isHandRaised;
    isBRBOn = isHandRaised ? false : isBRBOn; // turn off brb if hand is raised
    await update({ isHandRaised, isBRBOn });
  };

  const toggleBRB = async () => {
    isBRBOn = !isBRBOn;
    isHandRaised = isBRBOn ? false : isHandRaised; // turn off hand raise if user is going away(brb on)
    await update({ isHandRaised, isBRBOn });
  };

  return {
    isHandRaised,
    isBRBOn,
    metaData,
    updateMetaData: update,
    toggleHandRaise,
    toggleBRB,
  };
};
