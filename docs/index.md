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

## Alternate or Multiple backends 
If the frontend is hosted separately and it needs to talk to say an open API, that open API end-point would need to be specified the moment `Docker build .` is executed. In some cases the frontend might need to talk to multiple backends that are again unknown when the docker container is created. 

## Solution: Fetch backend host from frontend node server
Since a node sever is needed in the docker container, we can also ask that node server to tell us which backend to talk to. The node server, in turn could get that information from it's environment variables. These are populated when `Docker run` is executed. 

```
Docker run -e "API_HOST=https://mydockerdynamichost.com" -p 3000:3000 mydockerimagename
```

In the node server the following route is configured to serve the API_HOST environment to the frontend. 

```
app.get("/backendapiroute", (req, res) => {
  res.json({ apiHost: process.env.API_HOST });
});
```

Since a json object is returned, this object could be modified to supply multiple hosts if necessary. The important part is that we can get this configuration dynamically even while running in docker. 

In the frontend react code, we simply request this configuration when the application is first mounted. That information is then added to the window object for example, making it accessible everywhere. 

```
class App extends Component {
  componentDidMount() {
    fetch("/backendapiroute")
      .then(rsp => rsp.json())
      .then(rsp => {
        window.apiHost = rsp.apiHost;
      })
      .catch(e => console.error("failed to get the api host", e));
  }
  render() {
    return (
      <div className="App">
        <h1>Sample app testing dynamic backend</h1>
      </div>
    );
  }
}
```


