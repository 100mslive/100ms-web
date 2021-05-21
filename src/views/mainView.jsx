import { useHMSRoom } from "@100mslive/sdk-components";
import { TeacherScreenShareView } from "./teacherScreenShareView";
import { StudentScreenShareView } from './studentScreenShareView'
import { TeacherGridView } from "./teacherGridView";
import { isScreenSharing, isTeacher } from "../utlis/index";
import { StudentGridView } from "./studentGridView";

export const ConferenceMainView = ({ isChatOpen, toggleChat }) => {
  const { peers } = useHMSRoom();
  const getView = (peers) =>{
    switch(peers.some(isTeacher)){
      case true:
        switch(peers.some(isScreenSharing)){
          case true:
            return <TeacherScreenShareView isChatOpen={isChatOpen} toggleChat={toggleChat} />
          case false:
            return <TeacherGridView isChatOpen={isChatOpen} toggleChat={toggleChat} />
        }
      case false:
        switch(peers.some(isScreenSharing)){
          case true:
            return <StudentScreenShareView isChatOpen={isChatOpen} toggleChat={toggleChat} />
          case false:
            return <StudentGridView isChatOpen={isChatOpen} toggleChat={toggleChat} />
        }
    }
  }
  return (
    <>
      {getView(peers)}
    </>
  );
};
