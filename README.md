<p align="center" >
  <a href="https://100ms.live/">
  <img src="https://github.com/100mslive/100ms-ios-sdk/blob/main/100ms.gif" height=256/> 
  <img src="https://github.com/100mslive/100ms-ios-sdk/blob/main/100ms.svg" title="100ms logo" float=center height=256>
</p>

# 100ms 2.0 Sample React App

[![Documentation](https://img.shields.io/badge/Read-Documentation-blue)](https://docs.100ms.live/javascript/v2/foundation/basics)
[![Discord](https://img.shields.io/badge/Community-Join%20on%20Discord-blue)](https://discord.gg/F8cNgbjSaQ)
[![Email](https://img.shields.io/badge/Contact-Know%20More-blue)](mailto:founders@100ms.live)

## About

This is an example React app to demo [100ms' React SDK](https://www.npmjs.com/package/@100mslive/hms-video-react).

Not using React? Find the [Javascript Quickstart here](https://docs.100ms.live/javascript/v2/guides/javascript-quickstart).

## Prerequisites

You will need [Node.js](https://nodejs.org) version v12.13.0 or greater installed on your system.

## Clone the repo

Get the code by cloning this repo using git.

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

Get your token endpoint from the [Developer section of 100ms' Dashboard](https://dashboard.100ms.live/developer)
![download](https://user-images.githubusercontent.com/11087313/140727818-43cd8be4-b3bf-4b34-9921-a77f9a1b819d.png)
Update the `REACT_APP_TOKEN_GENERATION_ENDPOINT` in `.env` file with the above token endpoint value (eg. `https://prod-in.100ms.live/hmsapi/example.app.100ms.live/`)

### Run the app
Then start the app with:

```bash
yarn start
```

The app now should be running at https://localhost:3000/. (Please ignore the 404 message, you need to join the right URL of the room. Next sections describe how to create a room and form the correct URL)

### Create a room

Create room from [100ms Dashboard](https://dashboard.100ms.live/create-room) & get the room_id & role of the created room. Room details page after creating the room gives you room_id and roles allowed in the room.

![image](https://prod-apps-public.s3.ap-south-1.amazonaws.com/Screenshot+2021-06-26+at+5.52.50+PM.png)

### Configure policy based UI

Depending on the value of REACT_APP_POLICY_CONFIG in .env, you can customize which roles should be displayed in center stage and which roles should be display in side pane.

The value of REACT_APP_POLICY_CONFIG should be a JSON stringified object of the structure:

```ts
type HMSRoleName = string;

/**
 * undefined means none
 * empty array [] for all roles
 */
interface RoleConfig {
  center?: HMSRoleName[];
  sidepane?: HMSRoleName[];
  selfRoleChangeTo?: HMSRoleName[];
  remoteRoleChangeFor?: HMSRoleName[];
}

interface PolicyConfig {
  [role: string]: RoleConfig;
}
```

Example: `REACT_APP_POLICY_CONFIG = "{"trainer":{"center": ["student"],"sidepane":["trainer"]}}"`

It will be used in the app as:

```js
const envPolicyConfig = JSON.parse(process.env.REACT_APP_POLICY_CONFIG || "{}");
```
### Join the room

*Before running the app locally make sure you update the environment file (.env) with the respective REACT_APP_TOKEN_GENERATION_ENDPOINT and REACT_APP_POLICY_CONFIG to avoid parsing error*

Visit the URL : https://localhost:3000/meeting/<room_id>/< role > to join the room

![image](https://user-images.githubusercontent.com/5078656/119534649-c60da000-bda4-11eb-9847-f283e2daa06f.png)

Use any name & Click on join.
