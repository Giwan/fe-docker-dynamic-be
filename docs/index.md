# Docker hosted frontend with variable backend
The backend domains name is passed in when docker run is executed

## The problem
Our goal is to host the frontend in docker. The frontend is built using create-react-app which in turn uses webpack to bundle all assets. 
We would however, like to have a docker image which could accept a different host. In it's most basic form this would allow the TST, ACC and PRD frontend environments to dynamically connect to other backend environments. 

### Frontend and backend on same host
If the frontend and backend applications are on the same hosts, then the above issue does not really apply. The front-end could simply make requests to ```/api/```. The hosts used in the frontend would simply be used. 
This does require a special rule for the docker container hosting the frontend though. The frontend there can be served by a node server. That server would receive all incoming requests. Therefore, the express route configuration needs to be such that any request to ```/api``` is ignored allowing it to be passed through to the backend. 

```
/**
 * ensure build folder is served on root request
 */
app.use("^/$", express.static("build"));

/**
 * ensures the static resources are found after loading the file on /
 */
app.use(express.static(path.resolve(__dirname, "build")));

/**
 * If we make it to this point it's because the route is not
 * found in which case we should just load the front-end
 * except if it's an api request.
 */
app.use("^(?!api)", express.static("build"));
```

Line 28 of the above code intercepts any request that is not going to ```/api```.
Line 16 serves the build folder when the root domain is loaded and line 21 ensures the static folders reachable. 

