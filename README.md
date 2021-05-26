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

Create your room creation and token generation service [following the instructions here](https://100ms.gitbook.io/100ms-v2/server-side/100ms-quickstart-app-server)

Update the `REACT_APP_TOKEN_GENERATION_ENDPOINT` in `.env` file with your token generation service endpoint (eg. `https://ms-services-qa-in-m5yklnv1nlsd.runkit.sh/api/token`) 

>Remember to append /api/token at the end

### Create room

Create your room by calling the /api/room endpoint from your cloned runkit service above. You can use [this postman collection](https://www.getpostman.com/collections/0167b3cdf91cddf9642c) to call the API.

Copy the room_id returned by this API

Then start the app with:

```bash
yarn dev
```

Enter the room_id you've copied in the login screen. Use any name/role. Click join.

The app should now be up and running at http://localhost:3000 🚀
![image](https://user-images.githubusercontent.com/5078656/119534649-c60da000-bda4-11eb-9847-f283e2daa06f.png)

