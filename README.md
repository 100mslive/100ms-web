# ⚠️[Experimental]⚠️ 100ms 2.0 Sample React App

This is an example web app to demo 100ms' web SDK

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
npm install
```

Create a new file `.env` and copy the values from `example.env`

```bash
cp example.env .env
```

### Room creation and Token generation

Create your room creation and token generation service [following the instructions here](https://app.gitbook.com/@100ms/s/100ms-v2/server-side/100ms-quickstart-app-server)

Update the `REACT_APP_TOKEN_GENERATION_ENDPOINT` in `.env` file with your token generation service endpoint (eg. `https://ms-services-qa-in-m5yklnv1nlsd.runkit.sh/`)

Then start the app with:

```bash
npm run dev
```

The app should now be up and running at http://localhost:3000 🚀
