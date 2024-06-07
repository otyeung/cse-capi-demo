# cse-capi-demo

## Start Server and Client indpendently

### Start Server

Server runs on port 4000 locally. Open terminal in your apps directory, run

```
cd server
npm i
npm start
```

### Start Client

Modify REACT_APP_SERVER_URL in "server/.env", default is "http://localhost:4000"

Open terminal in your apps directory, run

```
cd client
npm i
npm start
```

Client runs on port 3000. Open chrome browser and open "http://localhost:3000" to launch the apps

## Start Server & Client at the same time

Open terminal in your apps directory, run

```
cd client
npm i
npm run start:dev
```

Client runs on port 3000. Open chrome browser and open "http://localhost:3000" to launch the apps
