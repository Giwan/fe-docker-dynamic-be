# Docker hosted front-end with variable back-end

The back-end domain name is passed in when docker run is executed

## The Problem

The static front-end must be hosted in docker. That means that the docker container must include a server application like NodeJS, Nginx, Apache, etc. which will serve the static front-end.

The docker image should be able to request data from *variable* backend hosts. Most importantly, **only at runtime** is it known who the backend is going to be. When *building* the docker image, this information is still missing. In its most basic form this would allow the TST, ACC and PRD front-end environments to dynamically connect to other back-end environments.

### Find and Replace
One possible solution, is to perform a **find and replace** on the finished JS bundle. A unique marker is set in the code to identify the backend host url. Using a perl script for example, the marker is replaced with the value for the specific environment. 
This can be a step in gitlab-ci and configured to be different per environment. 

Personally I don't like this solution because: 
- It changes the JS after the build step

  *I expect the JS bundle to be the same everywhere* (again just a preference)
  
- It feels hacky

  *If bugs creep into the script, these could be tricky to find and resolve*
  
The solution presented below is not perfect. It takes a performance hit. However that hit can also be resolved with server side rendering for React which is a much cleaner and ultimately faster solution since the JS is rendered on the server. 

### Front-end and back-end on same host

**If the front-end and back-end applications are on the same hosts, then the above issue does not apply**. The front-end simply makes requests to `/api/`. The NodeJS server is configured to ignore any request to `/api`, ensuring that the requests fall through to the backend server where they can be handled.

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

`app.use(express.static(path.resolve(__dirname, "build")));` ensures the static folders are reachable.

The last line intercepts any request that is not going to `/api` but any other (deep) route and redirects back to the static build folder. This solves the route not found issue when the user refreshes the page on a non "/" route.

## Alternate or Multiple back-ends (DIFFERENT DOMAIN)

If the front-end is hosted separately and it needs to talk to say an open API, that open API end-point would need to be specified the moment `Docker build .` is executed. In some cases the front-end might need to talk to multiple backends that are again unknown when the docker container is created.

## Solution: Fetch back-end host from front-end node server

The docker container needs a server to serve the static front-end!
On initial load, that server can dynamically inform the frontend which back-end it should get its data from. Using a _node server_, allows for that information to be easily read from environment variables. These, in turn, are populated at run time when `Docker run` is executed.

```
Docker run -e "API_HOST=https://mydockerdynamichost.com" -p 3000:3000 mydockerimagename
```

In the node server the following route is configured to serve the API_HOST environment to the front-end. It's able to read the API_HOST environment variable immediately. 

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


---
There are a few more things to add to this document: 
- How to construct the frontend code such that it can easily use the dynamic API_HOST everywhere
- How to leverage Server Side Rendering to improve performance on this construct
