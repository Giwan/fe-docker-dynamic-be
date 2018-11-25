# React frontend hosted in docker with a variable backend

## The backend is determined on docker run

At edia we needed a template that would allow us to host our front-end application in docker while still allowing for various backends to be provided.
In some cases the backend would be on the same host as the frontend while on others these could be completely different.

The following describes the details of this template and how it is constructed.

Technology stack

-   Docker
-   node
-   express
-   static assets (html, css, javascript)

When the application starts it sends a request to the server to get the backend host. It needs to do this before any api requests are made.
There are several ways of addressing this. Perform the initial request first and then load the application.

### Load apiHost using componentDidMount

Loading the apiHost using componentDidMount means that react app itself is not blocked until this request is complete. However the apiHost now needs to be added to a global variable so that it can be accessed from everywhere. While it works, it does introduce an artificial delay into the application.

### Can the api host be added using server side rendering

With server side rendering, the react front-end is rendered on the server on the initial GET request. During that step it would be possible to embed the apiHost along with any other data needed on the initial render.

There is already an express server, that is serving the application. It however, does not yet render it, it simply sends the static assets. If it did the initial render on the server, it could embed the apiHost into the application and send that to the server.

# Running in Docker

With server side rendering in place, the application can now also be started in Docker. First build the image.

```bash

# first build the image
docker build -t apihostimage .

# then run it with the env vars that need to be passed through.
docker run -e "API_HOST=https://dockerhostprod.com" -p 3000:3000 apihostimage

```

## Testing

Using chrome's `view-source:http://localhost:3000/` it's easy to see that that value for the api host is provided on the initial render.
This can also be tested with the CURL command.

```bash
# Double check that the apiHost is available on the first request
curl http://localhost:3000
```
