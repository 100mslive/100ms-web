import React, { useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Header, Preview, useHMSRoom } from '@100mslive/sdk-components';
import { AppContext } from '../store/AppContext';
import getToken from "../utlis/index";

const PreviewScreen = () => {
    const history = useHistory();
    const context = useContext(AppContext);
    const { loginInfo, setLoginInfo } = context;
    const { toggleMute } = useHMSRoom();

    const join = () => {
        getToken(loginInfo.username, loginInfo.role, loginInfo.roomId)
            .then((token) => {
                setLoginInfo({ token });
                history.push("/meeting");
            })
            .catch((error) => {
                console.log(error);
                alert("Unable to generate token");
            });
    };

    const goBack = () => {
        history.push("/");
    }

    useEffect(() => {
        if (loginInfo.username === "")
            history.push("/");
    }, [loginInfo.username])

    return (loginInfo.username ?
        <div>
            <div style={{ padding: "25px", height: "10%" }}>
                <Header />
            </div>
            <div className="flex justify-center items-center">
                <Preview
                    name={loginInfo.username}
                    joinOnClick={join}
                    goBackOnClick={goBack}
                    toggleMute={toggleMute}
                    messageOnClose={goBack}
                />
            </div>
        </div>
        :
        null
    )
};

export default PreviewScreen;