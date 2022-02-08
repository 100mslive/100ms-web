import React from "react";
import { useHMSStore, selectPeerCount } from "@100mslive/react-sdk";
import { ConferenceHeader } from "../headerView";

const PeerlistPreview = () => {
  const count = useHMSStore(selectPeerCount);
  return (
    <>
      {count > 0 ? (
        <div className="w-full h-16 flex items-center justify-between pr-4">
          <ConferenceHeader isPreview={true} />
        </div>
      ) : null}
    </>
  );
};

export default PeerlistPreview;
