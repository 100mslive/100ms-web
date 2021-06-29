# ⚠️[Alpha]⚠️ 100ms 2.0 Sample React App

This is an example React app to demo 100ms' React SDK

## Prerequisites

You will need [Node.js](https://nodejs.org) version v12.13.0 or greater installed on your system

## Clone the repo

Get the code by cloning this repo using git

```bash
git clone git@github.com:100mslive/100ms-web-v2.git
```

Once cloned, open the terminal in the project directory, and install dependencies with:

```bash
cd 100ms-web-v2
yarn install
```

Create a new file `.env` and copy the values from `example.env`

```bash
cp example.env .env
```


### Get the token generation endpoint

Get your token generation endpoint [following the instructions here](https://docs.100ms.live/v2/server-side/100ms-quickstart-app-server)

Update the `REACT_APP_TOKEN_GENERATION_ENDPOINT` in `.env` file with your token generation service endpoint (eg. `https://prod-in.100ms.live/hmsapi/example.app.100ms.live/`) 



### Run the app

Then start the app with:

```bash
yarn dev
```
The app now should be running at https://localhost:3000/. (Please ignore the 404 message, you need to join the right URL of the room. Next sections describe how to create a room and form the correct URL)


### Create a room

Create room from [100ms Dashboard] (https://dashboard.100ms.live/create-room) & get the room_id & role of the created room. Room details page after creating the room gives you room_id and roles allowed in the room.


![image](https://prod-apps-public.s3.ap-south-1.amazonaws.com/Screenshot+2021-06-26+at+5.52.50+PM.png) 



### Join the room

Visit the URL : https://localhost:3000/meeting/<room_id>/< role > to join the room


![image](https://user-images.githubusercontent.com/5078656/119534649-c60da000-bda4-11eb-9847-f283e2daa06f.png)
  
Use any name & Click on join. 



