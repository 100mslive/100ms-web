import React, { useEffect, useContext } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory, useParams } from "react-router-dom";
import { ConferenceHeader } from "../views/headerView";
import { ConferenceFooter } from "../views/footerView";
import { ConferenceMainView } from "../views/mainView";

export const Conference = () => {
  const history = useHistory();
  const { roomId: urlRoomId } = useParams();
  const context = useContext(AppContext);

  const { loginInfo, leave } = context;

  if (!loginInfo.token) {
    history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
  }
  useEffect(() => {
    return () => {
      leave();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full dark:bg-black">
      <div style={{ height: "10%" }}>
        <ConferenceHeader />
      </div>
      <div className="w-full flex" style={{ height: "80%" }}>
        <ConferenceMainView />
      </div>
      <div className="dark:bg-black" style={{ height: "10%" }}>
        <ConferenceFooter />
      </div>
    </div>
  );
};
