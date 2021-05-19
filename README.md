# 100ms Sample React App

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

Create your room creation and token generation service [following the instructions in this repo](https://github.com/100mslive/100ms-server-python-flask)

Update the `TOKEN_ENDPOINT` in `.env` file with your token generation service endpoint (eg. `https://localhost:5000/client-side`)

Then start the app with:

```bash
npm start
```

The app should now be up and running at http://localhost:3000 🚀
