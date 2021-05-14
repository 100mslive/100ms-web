import { useHMSRoom } from "@100mslive/sdk-components";
import { ScreenShareView } from "./screenShareView";
import { TeacherView } from "./teacherView";
import { isScreenSharing } from "../utlis/index";

export const ConferenceMainView = ({isChatOpen, toggleChat}) => {
  const { peers } = useHMSRoom();
  return (
    <>{peers.some(isScreenSharing) ? <ScreenShareView isChatOpen={isChatOpen} toggleChat={toggleChat} /> : <TeacherView isChatOpen={isChatOpen} toggleChat={toggleChat}/>}</>
  );
};
