import {
  selectPeers,
  selectLocalPeer,
  selectIsSomeoneScreenSharing,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { ScreenShareView } from "./screenShareView";
import React, { useContext } from "react";

import { AppContext } from "../store/AppContext";
import { GridCenterView, GridSidePaneView } from "./components/gridView";

import { App, Layouts } from "../common/layout";

export const ConferenceMainView = ({ isChatOpen, toggleChat }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const { maxTileCount } = useContext(AppContext);
  const isSomeoneScreenSharing = useHMSStore(selectIsSomeoneScreenSharing);
  const peers = useHMSStore(selectPeers);

  if (!localPeer) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  let ViewComponent;

  // screen sahring is onn
  if (isSomeoneScreenSharing) {
    ViewComponent = (
      <ScreenShareView isChatOpen={isChatOpen} toggleChat={toggleChat} />
    );
  }
  // No rule is specified so all peer will be shown in default view
  else if (!App[localPeer.role]) {
    ViewComponent = (
      <GridCenterView
        peers={peers}
        maxTileCount={maxTileCount}
        allowRemoteMute={true}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        hideSidePane={true}
      />
    );
  }
  // Default view with no sideBar view
  else if (App[localPeer.role].name === Layouts.DEFAULT) {
    ViewComponent = (
      <GridCenterView
        peers={peers.filter((peer) => App[localPeer.role].roles.has(peer.role))}
        maxTileCount={maxTileCount}
        allowRemoteMute={true}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        hideSidePane={true}
      />
    );
  }
  // Grid view with sideBar
  // if all peers are apearing side bar or stage then shift to defaultView
  else if (App[localPeer.role].name === Layouts.GRIDVIEW) {
    const containsSideViewPeer = peers
      .filter((peer) => App[localPeer.role].roles.has(peer.role))
      .some((peer) => App[localPeer.role].sideView.has(peer.role));
    const containStageViewPeer = peers
      .filter((peer) => App[localPeer.role].roles.has(peer.role))
      .some((peer) => App[localPeer.role].stageView.has(peer.role));
    // all peers in center stage or sidebar, so changing to default view
    if (!containStageViewPeer || !containsSideViewPeer)
      ViewComponent = (
        <GridCenterView
          peers={peers}
          maxTileCount={maxTileCount}
          allowRemoteMute={true}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          hideSidePane={true}
        />
      );
    else
      ViewComponent = (
        <>
          <GridCenterView
            peers={peers.filter((peer) =>
              App[localPeer.role].stageView.has(peer.role)
            )}
            maxTileCount={maxTileCount}
            allowRemoteMute={true}
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            hideSidePane={false}
          ></GridCenterView>
          <GridSidePaneView
            peers={peers.filter((peer) =>
              App[localPeer.role].sideView.has(peer.role)
            )}
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
          ></GridSidePaneView>
        </>
      );
  }

  return ViewComponent;
};
