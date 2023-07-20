import {
  InteractionClosedIcon,
  InteractionOpenIcon,
} from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/roomkit-react";
import IconButton from "../../IconButton";
import { useWidgetToggle } from "../AppData/useSidepane";
import { useWidgetState } from "../AppData/useUISettings";

export const ToggleWidgets = () => {
  const toggle = useWidgetToggle();
  const { widgetView } = useWidgetState();

  return (
    <Tooltip title="Toggle Widget Menu">
      <IconButton data-testid="get_widgets" onClick={() => toggle()} icon>
        {widgetView ? <InteractionOpenIcon /> : <InteractionClosedIcon />}
      </IconButton>
    </Tooltip>
  );
};
