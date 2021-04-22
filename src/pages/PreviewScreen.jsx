import React from 'react';
import { useHistory } from "react-router-dom";
import { Preview, useHMSRoom } from '@100mslive/sdk-components';

const PreviewScreen = () => {
    const history = useHistory();

    const { peers, leave } = useHMSRoom();

    console.log("PEERS ARE ", peers);

    const join = () => {
        // alert("Join Clicked!");
        history.push("/meeting");
    }

    const goBack = () => {
        // alert("Go Back Clicked!");
        leave();
        history.push("/");
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Preview
                peers={peers}
                roomName={`Meeting Room`}
                joinOnClick={join}
                goBackOnClick={goBack}
            />
        </div>

    )
};

export default PreviewScreen;