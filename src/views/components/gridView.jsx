import React from "react";
import {
  VideoList,
  FirstPersonDisplay,
  isMobileDevice,
} from "@100mslive/hms-video-react";
import { ChatView } from "./chatView";
import { getBlurClass } from "../../common/utils";

const MAX_TILES_FOR_MOBILE = 4;

/**
 * the below variables are for showing webinar etc. related image if required on certain meeting urls
 */
const webinarProps = JSON.parse(process.env.REACT_APP_WEBINAR_PROPS || "{}");
const eventRoomIDs = webinarProps?.ROOM_IDS || [];
const eventsImg = webinarProps?.IMAGE_FILE || "";  // the image to show in center
// the link to navigate to when user clicks on the image
const webinarInfoLink = webinarProps?.LINK_HREF || "https://100ms.live/";

// The center of the screen shows bigger tiles
export const GridCenterView = ({
  peers,
  maxTileCount,
  allowRemoteMute,
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  hideSidePane,
  totalPeers,
  videoTileProps,
}) => {
  return (
    <div
      className={`h-full ${
        hideSidePane && !isChatOpen ? "w-full" : "w-full md:w-4/5"
      }`}
    >
      {peers && peers.length > 0 ? (
        <VideoList
          peers={peers}
          classes={{
            videoTileContainer: "rounded-lg",
          }}
          maxTileCount={isMobileDevice() ? MAX_TILES_FOR_MOBILE : maxTileCount}
          allowRemoteMute={allowRemoteMute}
          videoTileProps={videoTileProps}
        />
      ) : eventRoomIDs.some(id => window.location.href.includes(id)) ? (
        <div className="h-full w-full grid place-items-center p-5">
          <a href={webinarInfoLink} target="_blank" rel="noreferrer">
            <img
              className="w-full rounded-lg shadow-lg p-2"
              alt=""
              src={eventsImg}
            />
          </a>
        </div>
      ) : (
        <FirstPersonDisplay classes={{ rootBg: "h-full" }} />
      )}
      {isChatOpen && hideSidePane && (
        <div
          className={`h-1/2 ${
            isMobileDevice() ? `w-3/4` : `w-2/10`
          } absolute z-40 bottom-20 right-0 ${getBlurClass(
            isParticipantListOpen,
            totalPeers
          )}`}
        >
          <ChatView toggleChat={toggleChat} />
        </div>
      )}
    </div>
  );
};

// Side pane shows smaller tiles
export const GridSidePaneView = ({
  peers,
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  totalPeers,
  videoTileProps,
}) => {
  const isMobile = isMobileDevice();
  const rowCount = isMobile ? 1 : undefined;

  return (
    <div className="flex flex-col w-full h-1/4 md:w-1/5 md:h-full pl-3 pr-3 md:pl-0 md:pr-0">
      <div className="flex flex-1 items-end w-full">
        {peers && peers.length > 0 && (
          <VideoList
            peers={peers}
            classes={{
              root: "",
              videoTileContainer: `rounded-lg ${isMobile ? "p-0 mr-2" : ""}`,
            }}
            maxColCount={2}
            maxRowCount={rowCount}
            compact={true}
            videoTileProps={videoTileProps}
          />
        )}
      </div>
      {isChatOpen && (
        <div
          className={`flex h-1/2 items-end p-2 ${getBlurClass(
            isParticipantListOpen,
            totalPeers
          )}`}
        >
          <div className="w-full h-full">
            <ChatView toggleChat={toggleChat} />
          </div>
        </div>
      )}
    </div>
  );
};
