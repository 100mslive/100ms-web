// TODO: it's our interface and should be moved to component library
// in fact our sdk component's join should take care of all this, if it fails
// useNotifications hook will give the notification, to know if you're connected
// this can be done const isConnected = useStore(selectIsRoomConnected)
export default async function getToken(username, role, roomId, env) {
    console.log(username, role, roomId, process.env.REACT_APP_ENV);
    console.log(process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT);
    const response = await fetch(process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT, {
        method: "POST",
        //TODO remove env
        body: JSON.stringify({
                env: process.env.REACT_APP_ENV,
            role: role,
            room_id: roomId,
            user_name: username,
        }),
    });

    const { token } = await response.json();

    return token;
}