import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../store/AppContext";
import { Join } from "@100mslive/sdk-components";

export const JoinRoom = () => {
  const history = useHistory();
  const { setLoginInfo } = useContext(AppContext);

  const join = ({ username, roomId, role }) => {
    setLoginInfo({ username: username, role: role, roomId: roomId });
    history.push("/preview");
  };
  return (
    <div className=" flex justify-center items-center w-full h-full text-white">
      <Join submitOnClick={join} />
    </div>
  );
};
