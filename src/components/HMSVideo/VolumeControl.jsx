import { useState } from "react";
import { SpeakerIcon } from "@100mslive/react-icons";
import { Flex, Slider } from "@100mslive/roomkit-react";

export const VolumeControl = ({ hlsPlayer }) => {
  const [volume, setVolume] = useState(hlsPlayer?.volume ?? 100);

  return (
    <Flex align="center" css={{ color: "$on_primary_high" }}>
      <SpeakerIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVolume(0);
          if (hlsPlayer) {
            hlsPlayer.setVolume(0);
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
          hlsPlayer.setVolume(volume);
          setVolume(volume);
        }}
        thumbStyles={{ w: "$6", h: "$6" }}
      />
    </Flex>
  );
};
