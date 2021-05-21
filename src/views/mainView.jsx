import {selectLocalPeer, selectIsSomeoneScreenSharing, useHMSStore} from "@100mslive/sdk-components";
import { TeacherScreenShareView } from "./teacherScreenShareView";
import { StudentScreenShareView } from './studentScreenShareView'
import { TeacherGridView } from "./teacherGridView";
import { StudentGridView } from "./studentGridView";

export const ConferenceMainView = ({ isChatOpen, toggleChat }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const isSomeoneScreenSharing = useHMSStore(selectIsSomeoneScreenSharing);

  let ViewComponent = null;

  switch (localPeer.role) {
    case ROLES.TEACHER:
      ViewComponent = isSomeoneScreenSharing ? TeacherScreenShareView : TeacherGridView;
      break;
    case ROLES.STUDENT:
      ViewComponent = isSomeoneScreenSharing ? StudentScreenShareView : StudentGridView;
      break;
  }

  return ViewComponent && <ViewComponent isChatOpen={isChatOpen} toggleChat={toggleChat} />;
};
