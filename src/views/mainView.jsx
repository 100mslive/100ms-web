import { useHMSRoom } from "@100mslive/sdk-components";
import { ScreenShareView } from "./screenShareView";
import { TeacherView } from "./teacherView";
import { isScreenSharing, isTeacher } from "../utlis/index";
import { StudentView } from "./studentView";

export const ConferenceMainView = ({ isChatOpen, toggleChat }) => {
  const { peers } = useHMSRoom();
  return (
    <>
      {peers.some(isScreenSharing) ? (
        <ScreenShareView isChatOpen={isChatOpen} toggleChat={toggleChat} />
      ) : peers.some(isTeacher) ? (
        <TeacherView isChatOpen={isChatOpen} toggleChat={toggleChat} />
      ) : (
        <StudentView isChatOpen={isChatOpen} toggleChat={toggleChat} />
      )}
    </>
  );
};
