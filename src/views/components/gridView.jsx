import { VideoList, FirstPersonDisplay } from "@100mslive/hms-video-react";
import React from "react";
import { ChatView } from "./chatView";

// The center of the screen shows bigger tiles
export const GridCenterView = ({
  peers,
  maxTileCount,
  allowRemoteMute,
  isChatOpen,
  toggleChat,
  hideSidePane,
}) => {
  return (
    <div
      className=" h-full"
      style={{ width: `${hideSidePane && !isChatOpen ? "100%" : "80%"}` }}
    >
      {peers && peers.length > 0 ? (
        <VideoList
          peers={peers}
          classes={{
            root: "",
            videoTileContainer: "rounded-lg",
            //video: "rounded-3xl",
          }}
          maxTileCount={maxTileCount}
          allowRemoteMute={allowRemoteMute}
        />
      ) : (
        <FirstPersonDisplay classes={{ rootBg: "h-full" }} />
      )}
      {isChatOpen && hideSidePane && (
        <div className="h-1/2 w-2/10 absolute z-40 bottom-20 right-0">
          <ChatView toggleChat={toggleChat}></ChatView>
        </div>
      )}
    </div>
  );
};

// Side pane shows smaller tiles
export const GridSidePaneView = ({ peers, isChatOpen, toggleChat }) => {
  return (
    <div className="flex flex-col" style={{ width: "20%" }}>
      <div className="flex flex-1 items-end w-full">
        {peers && peers.length > 0 && (
          <VideoList
            peers={peers}
            classes={{
              root: "",
              videoTileContainer: "rounded-lg",
              //video: "rounded-3xl",
            }}
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
