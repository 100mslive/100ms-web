import React from "react";

export const CreateRoom = () => {
  return (
    <div className=" flex justify-center items-center w-full h-full text-white">
      <div className="bg-gray-100 text-white w-1/2 m-2 p-3  rounded-lg divide-solid">
        <div className="text-2xl mb-3 p-3 border-b-2">Create a Room</div>

        <div className="flex flex-wrap text-sm">
          <div className="w-1/3 flex justify-end items-center">
            <span>Room Name:</span>
          </div>
          <div className="p-2 w-2/3">
            <input className="rounded-lg bg-gray-200 w-full p-1"></input>
          </div>
          <div className="w-1/3 flex justify-end items-center  ">
            <span>Description (optional):</span>
          </div>
          <div className="p-2 w-2/3">
            <input className="rounded-lg bg-gray-200 w-full p-1"></input>
          </div>
          <div className="w-1/3 flex justify-end items-center  ">
            <span>Username:</span>
          </div>
          <div className="p-2 w-2/3">
            <input className="rounded-lg bg-gray-200 w-full p-1"></input>
          </div>
          <div className="w-1/3 flex justify-end items-center ">
            <span>Role:</span>
          </div>
          <div className="p-2 w-2/3">
            <select name="role" className="rounded-lg bg-gray-200 w-full p-1">
              <option value="volvo">Teacher</option>
              <option value="saab">Student</option>
            </select>
          </div>
          <div className="w-full flex justify-end m-2">
            <button className="bg-blue-main rounded-lg px-5 py-2">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
