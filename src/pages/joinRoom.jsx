import React, { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../store/AppContext";
import { Join } from "@100mslive/hms-video-react";

export const JoinRoom = () => {
  const history = useHistory();
  const { roomId } = useParams();
  const { setLoginInfo } = useContext(AppContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setLoginInfo({ roomId }), [roomId]);
  const join = values => {
    setLoginInfo(values); // send to preview screen
    history.push(`/preview/${values.roomId}`);
  };
  return (
    <div className=" flex justify-center items-center w-full h-full text-white">
      <Join initialValues={{ roomId }} submitOnClick={join} />
    </div>
  );
};
