// @ts-check
import React from "react";
import {
  InteractionClosedIcon,
  InteractionOpenIcon,
} from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/roomkit-react";
import IconButton from "../../IconButton";
import { useWidgetToggle } from "../AppData/useSidepane";
import {
  useShowAudioShare,
  useShowPolls,
  useShowWhiteboard,
  useWidgetState,
} from "../AppData/useUISettings";

export const ToggleWidgets = () => {
  const { showWhiteboard } = useShowWhiteboard();
  const { showAudioShare } = useShowAudioShare();
  const { showPolls } = useShowPolls();

  const toggle = useWidgetToggle();
  const { widgetView } = useWidgetState();

  if (!(showAudioShare || showWhiteboard || showPolls)) {
    return null;
  }
  return (
    <Tooltip
      title="Toggle Widget Menu"
      boxCss={{
        zIndex: "100",
      }}
    >
      <IconButton data-testid="get_widgets" onClick={() => toggle()} icon>
        {widgetView ? <InteractionOpenIcon /> : <InteractionClosedIcon />}
      </IconButton>
    </Tooltip>
  );
};
