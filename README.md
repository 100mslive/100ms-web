# ⚠️[Alpha]⚠️ 100ms 2.0 Sample React App

This is an example React app to demo 100ms' React SDK

## Prerequisites

You will need [Node.js](https://nodejs.org) version v12.13.0 or greater installed on your system

## Setup

Get the code by cloning this repo using git

```bash
git clone git@github.com:100mslive/100ms-web-v2.git
```

Once cloned, open the terminal in the project directory, and install dependencies with:

```bash
cd 100ms-web-v2
yarn
```

Create a new file `.env` and copy the values from `example.env`

```bash
cp example.env .env
```

### Token generation server

Get your token generation endpoint [following the instructions here](https://100ms.gitbook.io/100ms-v2/server-side/100ms-quickstart-app-server)

Update the `REACT_APP_TOKEN_GENERATION_ENDPOINT` in `.env` file with your token generation service endpoint (eg. `https://prod-in.100ms.live/hmsapi/example.app.100ms.live/`) 

>Remember to append trailing `/` at the end

### Create room

Create room from [100ms Dashboard] (https://dashboard.100ms.live/create-room) & get the room_id & role of the created room.

Then start the app with:

```bash
yarn dev
```

The app should now be up and running at http://localhost:3000 🚀
![image](https://user-images.githubusercontent.com/5078656/119534649-c60da000-bda4-11eb-9847-f283e2daa06f.png)



Visit the URL : https://localhost:3000/meeting/<room_id>/<role> to join the room
  
Use any name & Click on join. 

