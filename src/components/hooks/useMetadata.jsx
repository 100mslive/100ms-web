import { useCallback, useState } from "react";
import {
  selectLocalPeerID,
  selectPeerMetadata,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";

export const useMyMetadata = () => {
  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeerID);
  const metaData = useHMSStore(selectPeerMetadata(localPeerId));
  const [isHandRaised, setHandRaised] = useState(
    metaData?.isHandRaised || false
  );
  const [isBRBOn, setBRBOn] = useState(metaData?.isBRBOn || false); // BRB = be right back

  const update = async updatedFields => {
    try {
      await hmsActions.changeMetadata(Object.assign(metaData, updatedFields));
      return true;
    } catch (error) {
      console.error("failed to update metadata ", metaData, updatedFields);
    }
  };

  const toggleHandRaise = useCallback(async () => {
    const brbUpdate = !isHandRaised ? false : isBRBOn;
    const success = await update({
      isHandRaised: !isHandRaised,
      isBRBOn: brbUpdate,
    });
    if (success) {
      setBRBOn(brbUpdate);
      setHandRaised(!isHandRaised);
    }
  }, [isHandRaised, isBRBOn]); //eslint-disable-line

  const toggleBRB = useCallback(async () => {
    const handRaiseUpdate = !isBRBOn ? false : isHandRaised;
    const success = await update({
      isHandRaised: handRaiseUpdate,
      isBRBOn: !isBRBOn,
    });
    if (success) {
      setBRBOn(!isBRBOn);
      setHandRaised(handRaiseUpdate);
    }
  }, [isHandRaised, isBRBOn]); //eslint-disable-line

  return {
    isHandRaised,
    isBRBOn,
    metaData,
    updateMetaData: update,
    toggleHandRaise,
    toggleBRB,
  };
};
