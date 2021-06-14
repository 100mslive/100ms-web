import React, { useEffect, useContext, useState, useCallback } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory, useParams } from "react-router-dom";
import { ConferenceHeader } from "../views/headerView";
import { ConferenceFooter } from "../views/footerView";
import { ConferenceMainView } from "../views/mainView";

export const Conference = () => {
  const history = useHistory();
  const { roomId, role } = useParams();
  const context = useContext(AppContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = useCallback(() => {
    setIsChatOpen(open => !open);
  }, []);

  const { loginInfo, leave, setLoginInfo } = context;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setLoginInfo({ roomId }), [roomId]);

  useEffect(() => {
    if (!roomId) {
      history.push(`/`);
    }
    if (!loginInfo.token) {
      // redirect to join if token not present
      if (role) history.push(`/preview/${loginInfo.roomId || roomId || ""}/${role}`);
      else history.push(`/preview/${loginInfo.roomId || roomId || ""}`);
    }

    return () => {
      leave();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col dark:bg-black">
      <div className="h-14 md:h-16">
        <ConferenceHeader />
      </div>
      <div className="w-full flex flex-1 flex-col md:flex-row">
        <ConferenceMainView isChatOpen={isChatOpen} toggleChat={toggleChat} />
      </div>
      <div className="dark:bg-black" style={{ height: "10%" }}>
        <ConferenceFooter isChatOpen={isChatOpen} toggleChat={toggleChat} />
      </div>
    </div>
  );
};
