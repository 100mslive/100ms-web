// @ts-check
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { MusicIcon } from "@100mslive/react-icons";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useWhenAloneInRoom } from "../../common/hooks";

const ambientMusicURL = process.env.REACT_APP_AMBIENT_MUSIC;
/**
 * @type HTMLAudioElement
 */
let ambientAudio = null;
if (ambientMusicURL) {
  try {
    ambientAudio = new Audio(ambientMusicURL);
  } catch (err) {
    console.error(err);
  }
}

/**
 *
 * @param {number} threshold the threshold after which the music is played(from the starting to be alone in the room)
 * @returns {Object}
 * ready: boolean - the threshold has passed and the music can be played,
 *
 * playing: boolean - flag to denote whether music is playing,
 *
 * toggleAmbientMusic - function to play/pause the music
 */
const useAmbientMusic = (threshold = 5 * 1000) => {
  const audioRef = useRef(ambientAudio);
  const { enableAmbientMusic: userHasEnabled, setEnableAmbientMusic } =
    useContext(AppContext); // user settings
  const [playing, setPlaying] = useState(false);

  const { alone: aloneRightNow, aloneForLong } = useWhenAloneInRoom(threshold);

  // play if user has enabled the setting and been alone for some time
  const shouldMusicBePlayed = !playing && userHasEnabled && aloneForLong;
  // pause immediately if user has disabled the setting or not alone anymore
  const shouldMusicBePaused = playing && (!userHasEnabled || !aloneRightNow);

  useEffect(() => {
    if (shouldMusicBePlayed && audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .catch(err => console.error("Unable to play Ambient Music", err));
      setPlaying(true);
    }
  }, [shouldMusicBePlayed]);

  useEffect(() => {
    if (shouldMusicBePaused) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [shouldMusicBePaused]);

  useEffect(() => {
    const ref = audioRef.current;
    // Stop on leave
    return () => {
      if (ref) {
        ref.pause();
      }
    };
  }, []);

  const toggleAmbientMusic = useCallback(
    () => setEnableAmbientMusic(!playing), // save user settings
    [playing, setEnableAmbientMusic]
  );

  return { ready: aloneForLong, playing, toggleAmbientMusic };
};

export const AmbientMusic = () => {
  const { ready, playing, toggleAmbientMusic } = useAmbientMusic();
  if (!ambientAudio || !ready) {
    return null;
  }

  return (
    <Tooltip
      title={`${playing ? `Disable Ambient Music` : `Play Ambient Music`}`}
      key="ambient-music"
    >
      <IconButton
        css={{ mx: "$4" }}
        onClick={toggleAmbientMusic}
        active={!playing}
      >
        <MusicIcon />
      </IconButton>
    </Tooltip>
  );
};
