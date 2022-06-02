# Collaborative Whiteboard setup

## Pusher Account

- Create an Pusher account at https://pusher.com/.
- Create a new channels app.
- Go to the “App Keys” page for that app(apps list view at https://dashboard.pusher.com/apps), and make a note of your app_id, key, secret and cluster.
- Go to the "App Settings" page and enable client events.

## Whiteboard Server

- Fork the whiteboard pusher server from https://github.com/100mslive/whiteboard-server and deploy it using your preferred hosting provider.
- Add the pusher keys noted earlier to environment variables.

```
APP_CLUSTER="cluster"
APP_SECRET="secret"
APP_KEY="key"
APP_ID="app_id"
```

- The API path is `api/pusher/auth`, say your deployment URL is `whiteboard-server.vercel.app`, the Pusher Auth Endpoint is `https://whiteboard-server.vercel.app/api/pusher/auth`

## Whiteboard Client

- Copy the whole folder at `/src/plugins/whiteboard` into your live video conferencing apps using 100ms' SDKs.
- Add the pusher app key and pusher auth endpoint to `REACT_APP_PUSHER_APP_KEY` and `REACT_APP_PUSHER_AUTHENDPOINT` environment variables.
- The `useWhiteboardMetadata` hook returns state such as the whiteboard owner(`whiteboardOwner`) and action to toggle the whiteboard(`toggleWhiteboard`). Refer usage in `ToggleWhiteboard.jsx` - an icon button to toggle the whiteboard based on the active state.
- When the whiteboard is active(`whiteboardOwner` from `useWhiteboardMetadata` is not null), render the `Whiteboard` component on your UI to let your users draw on the whiteboard. Refer `mainView.jsx` and `WhiteboardView.jsx`.
