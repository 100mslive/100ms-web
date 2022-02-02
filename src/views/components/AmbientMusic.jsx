// @ts-check
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { MusicIcon } from "@100mslive/react-icons";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useWhenAloneInRoom } from "../../common/hooks";
import { AppContext } from "../../store/AppContext";

const ambientMusicURL = process.env.REACT_APP_AMBIENT_MUSIC;
/**
 * @type HTMLAudioElement
 */
let ambientAudio = null;
try {
  ambientAudio = new Audio(ambientMusicURL);
} catch (err) {
  console.error(err);
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
  const { enableAmbientMusic, setEnableAmbientMusic } = useContext(AppContext);
  const [playing, setPlaying] = useState(false);
  const [timedout, setTimedout] = useState(false);

  const alone = useWhenAloneInRoom(() => {
    play();
    setTimedout(true);
  }, threshold);

  const play = useCallback(() => {
    if (alone && enableAmbientMusic) {
      audioRef.current
        .play()
        .catch(err => console.error("Unable to play Ambient Music", err));
      setPlaying(true);
    }
  }, [alone, enableAmbientMusic]);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setPlaying(false);
  }, []);

  const toggleAmbientMusic = useCallback(
    () => setEnableAmbientMusic(!playing),
    [playing, setEnableAmbientMusic]
  );

  useEffect(() => {
    audioRef.current.volume = 0.2;
    audioRef.current.loop = true;
    if (!alone) {
      pause();
      setTimedout(false);
    }

    return () => {
      pause();
    };
  }, [alone, pause]);

  useEffect(() => {
    if (timedout) {
      if (enableAmbientMusic) {
        play();
      } else {
        pause();
      }
    }
  }, [enableAmbientMusic, timedout, pause, play]);

  return { ready: timedout, playing, toggleAmbientMusic };
};

export const AmbientMusic = () => {
  const { ready, playing, toggleAmbientMusic } = useAmbientMusic();
  if (!ready) {
    return null;
  }

  return (
    <Tooltip
      title={`${playing ? `Disable Ambient Music` : `Play Ambient Music`}`}
      key="ambient-music"
    >
      <IconButton
        css={{ mx: "$2" }}
        onClick={toggleAmbientMusic}
        active={!playing}
      >
        <MusicIcon />
      </IconButton>
    </Tooltip>
  );
};
