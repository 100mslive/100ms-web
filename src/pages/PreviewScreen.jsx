import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { Header, Preview } from '@100mslive/sdk-components';
import { AppContext } from '../store/AppContext';
import getToken from "../utlis/index";

const PreviewScreen = () => {
    const history = useHistory();
    const context = useContext(AppContext);
    const { loginInfo, setLoginInfo } = context;

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

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Preview
                name={loginInfo.username}
                joinOnClick={join}
                goBackOnClick={goBack}
            />
        </div>

    )
};

export default PreviewScreen;