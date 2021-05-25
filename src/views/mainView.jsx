import {selectLocalPeer, selectIsSomeoneScreenSharing, useHMSStore} from "@100mslive/hms-video-react";
import { TeacherGridView } from "./teacherGridView";
import { StudentGridView } from "./studentGridView";
import {ScreenShareView} from "./screenShareView";
import {ROLES} from "../common/roles";

export const ConferenceMainView = ({ isChatOpen, toggleChat }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const isSomeoneScreenSharing = useHMSStore(selectIsSomeoneScreenSharing);

  if (!localPeer) {  // we don't know the role yet to decide how to render UI
    return null;
  }

  const amITeacher = localPeer.role === ROLES.TEACHER;
  let ViewComponent;

  if (isSomeoneScreenSharing) {
    ViewComponent = ScreenShareView;
  } else {
    ViewComponent = amITeacher ? TeacherGridView : StudentGridView;
  }

  return ViewComponent && <ViewComponent isChatOpen={isChatOpen} toggleChat={toggleChat} />;
};
