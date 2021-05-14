import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../store/AppContext";
import { Join } from "@100mslive/sdk-components";

export const JoinRoom = () => {
  const history = useHistory();
  const { roomId } = useParams();
  const { setLoginInfo } = useContext(AppContext);
  const join = (values) => {
    setLoginInfo(values);
    history.push(`/preview/${values.roomId}`);
  };
  return (
    <div className=" flex justify-center items-center w-full h-full text-white">
      <Join
        initialValues={{ roomId, endpoint: "qa-in2" }}
        submitOnClick={join}
      />
    </div>
  );
};
