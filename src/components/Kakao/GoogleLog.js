import React, {useCallback, useEffect} from "react";
import GoogleLogin from "react-google-login";
import {gapi} from 'gapi-script';


const clientId = 
"379355791259-ho9qr8idbqjvt6ntqmfaeb1uek29gg04.apps.googleusercontent.com";

const GoogleLog = ({ onSocial }) => {
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId,
                scope: 'email',
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    const onSuccess = (response) => {
        console.log(response);
        window.location.replace('/')
    
    };
    const onFailure = (response) => {
        console.log(response);
    };
    return (
        <div>
            <GoogleLogin
            clientId={clientId}
            buttonText="구글아이디로 로그인하기"
            onSuccess={onSuccess}
            onFailure={onFailure}
            />
        </div>
    );
};

export default GoogleLog;