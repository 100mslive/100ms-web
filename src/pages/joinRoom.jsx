import React, { useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../store/AppContext";

export const JoinRoom = () => {
  const history = useHistory();
  const { roomId: urlRoomId } = useParams();
  const { setLoginInfo } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Teacher");
  const [endpoint, setEndpoint] = useState("qa2-us");
  const [roomId, setRoomId] = useState(urlRoomId || "607d781cdcee704ca43cafb9");
  const join = () => {
    const endpointUrl = `https://${endpoint}.100ms.live/init`;
    setLoginInfo({
      username: username,
      role: role,
      roomId: roomId,
      endpoint: endpointUrl,
    });
    history.push(`/preview/${roomId}`);
  };
  return (
    <div className=" flex justify-center items-center w-full h-full text-white">
      <div className="bg-gray-100 text-white w-1/2 m-2 p-3  rounded-lg divide-solid">
        <div className="text-2xl mb-3 p-3 border-b-2">Join your class</div>

        <div className="flex flex-wrap text-sm">
          <div className="w-1/3 flex justify-end items-center  ">
            <span>Username:</span>
          </div>
          <div className="p-2 w-2/3">
            <input
              className="rounded-lg bg-gray-200 w-full p-1"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            ></input>
          </div>
          <div className="w-1/3 flex justify-end items-center  ">
            <span>RoomId:</span>
          </div>
          <div className="p-2 w-2/3">
            <input
              className="rounded-lg bg-gray-200 w-full p-1"
              value={roomId}
              onChange={(event) => {
                setRoomId(event.target.value);
              }}
            ></input>
          </div>
          <div className="w-1/3 flex justify-end items-center ">
            <span>Role:</span>
          </div>
          <div className="p-2 w-2/3">
            <select
              name="role"
              className="rounded-lg bg-gray-200 w-full p-1"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
              }}
            >
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="w-1/3 flex justify-end items-center ">
            <span>Environment:</span>
          </div>
          <div className="p-2 w-2/3">
            <select
              name="endpoint"
              className="rounded-lg bg-gray-200 w-full p-1"
              value={endpoint}
              onChange={(event) => {
                setEndpoint(event.target.value);
              }}
            >
              <option value="qa2-us">qa2-us</option>
              <option value="qa-in2">qa-in2</option>
              <option value="prod-in2">prod-in2</option>
              <option value="dev-in2">dev-in2</option>
              <option value="100ms-grpc">100ms-grpc</option>
            </select>
          </div>
          <div className="w-full flex justify-end m-2">
            <button
              className="bg-blue-main rounded-lg px-5 py-2"
              onClick={join}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
