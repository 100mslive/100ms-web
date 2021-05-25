import { VideoList, FirstPersonDisplay } from "@100mslive/hms-video-react";

import React from "react";
import { ChatView } from "./chatView";

// The center of the screen shows bigger tiles
export const GridCenterView = ({ peers, maxTileCount, allowRemoteMute }) => {
  return (
    <div className=" h-full  " style={{ width: "80%" }}>
      {peers && peers.length > 0 ? (
        <VideoList
          peers={peers}
          classes={{
            root: "",
            videoTileContainer: "  rounded-lg",
            //video: "rounded-3xl",
          }}
          maxTileCount={maxTileCount}
          allowRemoteMute={allowRemoteMute}
        />
      ) : (
        <FirstPersonDisplay classes={{ rootBg: "h-full" }} />
      )}
    </div>
  );
};

// Side pane shows smaller tiles
export const GridSidePaneView = ({
  peers,
  isChatOpen,
  toggleChat,
  maxTileCount,
}) => {
  return (
    <div className="flex flex-col" style={{ width: "20%" }}>
      <div
        className={
          isChatOpen
            ? "flex items-end w-full  h-1/2"
            : "flex items-end w-full  h-full"
        }
      >
        {peers && peers.length > 0 && (
          <VideoList
            peers={peers}
            classes={{
              root: "",
              videoTileContainer: "rounded-lg",
              //video: "rounded-3xl",
            }}
            maxTileCount={maxTileCount}
            maxColCount={2}
            compact={true}
          />
        )}
      </div>
      {isChatOpen && (
        <div className="flex h-1/2 items-end p-2">
          <div className="w-full h-full">
            <ChatView toggleChat={toggleChat}></ChatView>
          </div>
        </div>
      )}
    </div>
  );
};
