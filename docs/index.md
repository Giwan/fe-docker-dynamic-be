# Docker hosted front-end with variable back-end

The back-end domain name is passed in when docker run is executed

## The problem

Our goal is to host the front-end in docker. The front-end is built using create-React-app which in turn uses webpack to bundle all assets.
We would however, like to have a docker image which could accept a different host. In its most basic form this would allow the TST, ACC and PRD front-end environments to dynamically connect to other back-end environments.

### Front-end and back-end on same host

If the front-end and back-end applications are on the same hosts, then the above issue does not really apply. The front-end could simply make requests to `/api/`. The host from the front-end would simply be applied to the backend.
This does require a special rule for the docker container hosting the front-end though. The front-end can be served by a server, node in this example. That node server would receive all incoming requests. Therefore, the express route configuration needs to be such that any request to `/api` is ignored allowing traffic to be passed through to the back-end.

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

`app.use("^/$", express.static("build"));` serves the build folder when the root domain is loaded.
`app.use(express.static(path.resolve(__dirname, "build")));` ensures the static folders reachable.
The last line intercepts any request that is not going to `/api` but any other (deep) route and redirects back to the static build folder. This solves the route not found issue when the user refreshes the page on a non "/" route.

## Alternate or Multiple back-ends

If the front-end is hosted separately and it needs to talk to say an open API, that open API end-point would need to be specified the moment `Docker build .` is executed. In some cases the front-end might need to talk to multiple backends that are again unknown when the docker container is created.

## Solution: Fetch back-end host from front-end node server

Since a node sever is needed in the docker container, we can also ask that node server to tell us which back-end to talk to. The node server, in turn could get that information from its environment variables. These are populated when `Docker run` is executed.

```
Docker run -e "API_HOST=https://mydockerdynamichost.com" -p 3000:3000 mydockerimagename
```

In the node server the following route is configured to serve the API_HOST environment to the front-end.

```
app.get("/backendapiroute", (req, res) => {
  res.json({ apiHost: process.env.API_HOST });
});
```

Since a JSON object is returned, this object could be modified to supply multiple hosts if necessary. The important part is that we can get this configuration dynamically even while running in docker.

In the front-end React code, we simply request this configuration when the application is first mounted. That information is then added to the window object for example, making it accessible everywhere.

```
class App extends Component {
  /**
   * Once the App is mounted, the API_HOST is fetched.
   * All /api request can now be directed to that host.
   * In this example it's stored on the window object
   * but it might even be cleaner to store this in Redux.
   * (no need to pollute the global object if we don't need to)
   */
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
        <h1>Sample app testing dynamic back-end</h1>
      </div>
    );
  }
}
```
