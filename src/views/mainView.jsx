import { useHMSRoom } from "@100mslive/sdk-components";
import { ScreenShareView } from "./screenShareView";
import { TeacherView } from "./teacherView";
import { isScreenSharing } from "../utlis/index";

export const ConferenceMainView = () => {
  const { peers } = useHMSRoom();
  return (
    <>{peers.some(isScreenSharing) ? <ScreenShareView /> : <TeacherView />}</>
  );
};
