import React from "react";
import { useHMSStore, selectPeerCount } from "@100mslive/react-sdk";
import { Flex } from "@100mslive/react-ui";
import { ConferenceHeader } from "../headerView";

const PeerlistPreview = () => {
  const count = useHMSStore(selectPeerCount);
  return (
    <>
      {count > 0 ? (
        <Flex
          align="center"
          justify="between"
          css={{ w: "100%", h: "$18", "@md": { h: "$17" } }}
        >
          <ConferenceHeader isPreview={true} />
        </Flex>
      ) : null}
    </>
  );
};

export default PeerlistPreview;
