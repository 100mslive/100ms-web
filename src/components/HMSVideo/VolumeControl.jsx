import { useState } from "react";
import { SpeakerIcon } from "@100mslive/react-icons";
import { Flex, Slider } from "@100mslive/react-ui";

export const VolumeControl = ({ videoRef }) => {
  const videoEl = videoRef.current;
  const [volume, setVolume] = useState(videoEl?.volume ?? 100);

  return (
    <Flex align="center" css={{ color: "$white" }}>
      <SpeakerIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVolume(0);
          if (videoRef.current) {
            videoRef.current.volume = 0;
          }
        }}
      />
      <Slider
        css={{
          mx: "$4",
          w: "$20",
          cursor: "pointer",
          "@sm": { w: "$14" },
          "@xs": { w: "$14" },
        }}
        min={0}
        max={100}
        step={1}
        value={[volume]}
        onValueChange={volume => {
          videoEl.volume = volume / 100;
          setVolume(volume);
        }}
        thumbStyles={{ w: "$6", h: "$6" }}
      />
    </Flex>
  );
};
