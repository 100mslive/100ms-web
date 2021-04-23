import React from 'react';
import { useHistory } from "react-router-dom";
import { Preview, useHMSRoom } from '@100mslive/sdk-components';
import { AppContext } from '../store/AppContext';

const PreviewScreen = () => {
    const history = useHistory();
    const context = useContext(AppContext);

    const join = () => {
        getToken(username, role, roomId)
            .then((token) => {
                setLoginInfo({ token, username, role });
                history.push("/meeting");
            })
            .catch((error) => {
                console.log(error);
                alert("Unable to genrate token");
            });
    };

    const goBack = () => {
        history.push("/");
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Preview
                name={context.}
                joinOnClick={join}
                goBackOnClick={goBack}
            />
        </div>

    )
};

export default PreviewScreen;