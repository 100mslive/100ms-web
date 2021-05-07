import React, { useEffect, useState, useContext } from "react";
import { VideoList, ChatBox } from "@100mslive/sdk-components";
import { useHMSRoom } from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import {
  HMSPeertoCameraStreamWithInfo,
  HMSPeerToScreenStreamWitnInfo,
} from "../utlis";

export const TeacherView = () => {
  const { isChatOpen, toggleChat, maxTileCount } = useContext(AppContext);

  const { peers, messages, speakers, sendMessage } = useHMSRoom();
  const [streamsWithInfo, setStreamsWithInfo] = useState([]);

  useEffect(() => {
    console.debug("app: Old streams info ");
    console.debug("app: Re-rendering video list with new peers ", peers);
    const videoStreamsWithInfo =
      peers && peers.length > 0 && peers[0]
        ? peers
            .filter((peer) => Boolean(peer.videoTrack || peer.audioTrack))
            .map((peer) => HMSPeertoCameraStreamWithInfo(peer, speakers))
        : [];
    console.debug("app: Computed camera streams info ", videoStreamsWithInfo);

    const screenShareStreamsWithInfo =
      peers && peers.length > 0 && peers[0]
        ? peers
            .filter(
              (peer) =>
                Boolean(peer.auxiliaryTracks) &&
                Boolean(peer.auxiliaryTracks.length > 0) &&
                (Boolean(
                  peer.auxiliaryTracks.find(
                    (track) => track.nativeTrack.kind === "audio"
                  )
                ) ||
                  Boolean(
                    peer.auxiliaryTracks.find(
                      (track) => track.nativeTrack.kind === "video"
                    )
                  ))
            )
            .map((peer) => HMSPeerToScreenStreamWitnInfo(peer, speakers))
        : [];
    console.debug(
      "app: Computed screenshare streams info ",
      screenShareStreamsWithInfo
    );
    setStreamsWithInfo([
      ...videoStreamsWithInfo,
      ...screenShareStreamsWithInfo,
    ]);
  }, [peers]);

  useEffect(() => {
    console.debug("app: Streams with info", streamsWithInfo);
  }, [streamsWithInfo]);

  return (
    <React.Fragment>
      <div className="w-full h-full flex">
        <div className={isChatOpen ? "w-8/10 h-full" : "w-full h-full"}>
          {streamsWithInfo && streamsWithInfo.length > 0 && (
            <VideoList
              streams={streamsWithInfo}
              classes={{
                root: "",
                videoTileContainer: " p-4 rounded-lg",
                //video: "rounded-3xl",
              }}
              showAudioMuteStatus={true}
              allowRemoteMute={true}
              maxTileCount={maxTileCount}
            />
          )}
        </div>
        {isChatOpen && (
          <div className="flex items-end p-2 w-2/10 h-full">
            <div className="w-full h-5/6">
              <ChatBox
                messages={messages}
                onSend={sendMessage}
                onClose={toggleChat}
              />
            </div>
          </div>
        )}
      </div>

      {/* <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Teacher")}
          classes={{
            videoTileParent: "p-5 rounded-xl",
            video: "rounded-xl",
          }}
          overflow="scroll-x"
          maxTileCount={4}
          showAudioMuteStatus={false}
        /> */}
    </React.Fragment>
  );
};
