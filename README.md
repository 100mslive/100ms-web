<p align="center" >
  <a href="https://100ms.live/">
  <img src="https://github.com/100mslive/100ms-ios-sdk/blob/main/100ms.gif" height=256/> 
  <img src="https://github.com/100mslive/100ms-ios-sdk/blob/main/100ms.svg" title="100ms logo" float=center height=256>
</p>


# 100ms 2.0 Sample React App

[![Documentation](https://img.shields.io/badge/Read-Documentation-blue)](https://docs.100ms.live/javascript/v2/foundation/basics)
[![Discord](https://img.shields.io/badge/Community-Join%20on%20Discord-blue)](https://discord.gg/F8cNgbjSaQ)
[![Email](https://img.shields.io/badge/Contact-Know%20More-blue)](mailto:founders@100ms.live)

This is an example React app to demo [100ms' React SDK](https://www.npmjs.com/package/@100mslive/react-sdk).
Not using React? Find the [Javascript Quickstart here](https://docs.100ms.live/javascript/v2/guides/javascript-quickstart).

- [100ms 2.0 Sample React App](#100ms-20-sample-react-app)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Cloning the repo](#cloning-the-repo)
    - [Setting environment variables](#setting-environment-variables)
      - [Getting the token generation endpoint](#getting-the-token-generation-endpoint)
    - [Run the app](#run-the-app)
  - [Creating and Joining a Room](#creating-and-joining-a-room)
    - [Create a room](#create-a-room)
    - [Join the room](#join-the-room)
  - [Customizing your app](#customizing-your-app)
    - [Configure UI layout](#configure-ui-layout)
    - [Tile Aspect Ratio](#tile-aspect-ratio)
    - [Theme and Color](#theme-and-color)
    - [Playlist Tracks (Watch Party)](#playlist-tracks-watch-party)
  - [Building and deployment](#building-and-deployment)
    - [Building the app](#building-the-app)
    - [Deploying the code](#deploying-the-code)
  - [Further reading](#further-reading)

## Getting started

### Prerequisites

100ms-web is a react application and need the following to setup the app up and running on your development environment. You will need

* [Node.js](https://nodejs.org) version v16.7.0 or greater installed on your system.
* [yarn](https://yarnpkg.com/)

> Note (npm users only): 
> if you are using `npm`, it is a hard dependency to use node `v16.7.0` (npm `v7.20.0`) because of some peer-dependency [issues](#noteerr-unable-to-resolve-dependency-tree-error)

There are other dependencies like webpack but these are installed automatically when we do `yarn install`

### Cloning the repo

-   Get the code by cloning this repo using [git](https://git-scm.com/).

  ```bash
  git clone git@github.com:100mslive/100ms-web.git
  ```

-   Once cloned, open a terminal in the project directory, and install dependencies with:

  ```bash
  cd 100ms-web
  yarn install
  ```
  or

  ```bash
  cd 100ms-web
  npm install
  ```

> Note (ERR! unable to resolve dependency tree error): 
> `npm install` might fail because some of our dependency libraries haven't updated their peer dependencies to React 18. This should automatically get fixed when the respective authors update their libraries. Currently, this issue could be fixed by installing atleast node `v16.7.0`. Although, we recommend using `yarn` instead of `npm` if you can.

### Setting environment variables

Environment variables let you customize the app and set important things like token generation endpoint([see below](#getting-the-token-generation-endpoint)). We have a example.env as a template to help you get started with.You can add remove stuff to it as per your needs. To begin with, create a new file `.env` and copy the values from `example.env`

```bash
cp example.env .env
```

> Note: 
> * If you change your environment variables, your webapp must be restarted using `yarn start`. Otherwise, the changes won't take effect. Similarly, you might want to redeploy your app when using services like Vercel for new/updated environment variables to take effect.
> * The above method of setting the environment variables for your local development. Depending on what service/method you use for deployment (i.e) Netlify, Vercel, Nginx etc, setting up environment variables may be similar or different. See [Building and deployment](https://github.com/100mslive/100ms-web/wiki/Building-and-deployment) for specific instructions or instructions provided by specific providers.

#### Getting the token generation endpoint

- Get your token endpoint from the [Developer section of 100ms' Dashboard](https://dashboard.100ms.live/developer)
  ![download](https://user-images.githubusercontent.com/11087313/140727818-43cd8be4-b3bf-4b34-9921-a77f9a1b819d.png)
- Update the `REACT_APP_TOKEN_GENERATION_ENDPOINT` in `.env` file with the above token endpoint value (eg. `https://prod-in.100ms.live/hmsapi/example.app.100ms.live/`)

### Run the app
Then start the app with:

```bash
yarn start
```

The app now should be running at [http://localhost:3000/](http://localhost:3000/). You should see a Welcome message saying "Almost There!". Follow the instructions on the page to create a new room. You can also check [Creating and Joining a Room section](#creating-and-joining-a-room) to see how to create a room.

## Creating and Joining a Room

### Create a room

Create room from [100ms Dashboard](https://dashboard.100ms.live/create-room) & get the room_id & role of the created room. Room details page after creating the room gives you room_id and roles allowed in the room.

![image](https://prod-apps-public.s3.ap-south-1.amazonaws.com/Screenshot+2021-06-26+at+5.52.50+PM.png)

### Join the room

* Before running the app locally make sure you update the environment file (.env) with the respective REACT_APP_TOKEN_GENERATION_ENDPOINT, the token endpoint will be present in the [developer section](https://dashboard.100ms.live/developer) on the dashboard.

* Visit the URL : `http://localhost:3000/meeting/<room_id>/<role>` to join the room

  ![image](https://user-images.githubusercontent.com/5078656/119534649-c60da000-bda4-11eb-9847-f283e2daa06f.png)

* Use any name & click on `join`.

Moving on, lets go ahead and [Customize our app](#customizing-your-app)

## Customizing your app

### Configure UI layout

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

It is used in the app as:

```js
const envPolicyConfig = JSON.parse(process.env.REACT_APP_POLICY_CONFIG || "{}");
```

### Tile Aspect Ratio

REACT_APP_TILE_SHAPE can be used for this, the format is `width-height`. For example, `1-1` for square tiles, `4-3` for landscape tiles and `16-9` for wide tiles.

### Theme and Color

**Env - REACT_APP_THEME**
- `dark` - for dark theme
- `light` - for light theme

**Env - REACT_APP_COLOR**
- You can give a hex code the color will be used for buttons, border audio level and such.

### Playlist Tracks (Watch Party)

This is a way to play any music or any videos from a url for everyone in the room to see/vibe to together. The support is only for file formats which are supported by the native audio and video elements, but it's super cool.

`REACT_APP_AUDIO_PLAYLIST` - a list of audio tracks which can be played by a person in the room for everyone
`REACT_APP_VIDEO_PLAYLIST` - a list of video tracks which can be played by a person in the room for everyone

That's it for the basics. You could continue to [Build and deploy your app](#building-and-deployment) or do [Further Reading](#further-reading) to understand more about 100ms-web.


## Building and deployment

### Building the app

> NOTE: 
> ⚠️  This section is under construction and the information here might be incomplete. Please reach out to us if you have any queries.

-   100ms-web app is just like any react application. To build the app, just run

  ```bash
  yarn build
  ```

-  If everything goes well, you should see something like this in the terminal.

  ```bash
  webpack 5.70.0 compiled successfully in 22546 ms
  ✨  Done in 30.72s.

  ```

- All the files that got built in the above step are in the `build/` directory. This is all we need to deploy. The files are just plain HTML/CSS/JS and could be deployed in many different ways. We discuss some popular ones below.

### Deploying the code

-  There are many ways to deploy 100ms-web. We discuss a few methods below. Please feel free to reach out to us if you don't find your preferred platform here.
   - [Netlify](https://github.com/100mslive/100ms-web/wiki/Deployment:-Netlify)
   - [AWS](https://github.com/100mslive/100ms-web/wiki/Deployment:-AWS)
   - [Vercel](https://github.com/100mslive/100ms-web/wiki/Deployment:-Vercel)
   - [Web server](https://github.com/100mslive/100ms-web/wiki/Deployment:-Web-Server)
   - [Docker](https://github.com/100mslive/100ms-web/wiki/Deployment:-Docker)

## Further reading

-  This section covers ways to further customize and understand the codebase. This section assumes you have already set up the webapp on your development machine and have it up and running. If not, please take a look at [Getting Started](#getting-started)

   * [Environment Variables](#environment-Variables)
   * [code structure](https://github.com/100mslive/100ms-web/wiki/code-structure)
   * [Architecture](https://github.com/100mslive/100ms-web/wiki/Architecture)