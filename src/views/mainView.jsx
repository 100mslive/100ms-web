import { useHMSStore, selectIsAnyoneScreenSharing } from "@100mslive/sdk-components";
import { ScreenShareView } from "./screenShareView";
import { TeacherView } from "./teacherView";

export const ConferenceMainView = ({isChatOpen, toggleChat}) => {
  const isAnyoneScreenSharing = useHMSStore(selectIsAnyoneScreenSharing);
  return (
    <>{isAnyoneScreenSharing ? <ScreenShareView isChatOpen={isChatOpen} toggleChat={toggleChat} /> : <TeacherView isChatOpen={isChatOpen} toggleChat={toggleChat}/>}</>
  );
};
