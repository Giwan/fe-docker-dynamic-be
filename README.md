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

### Add the api host during server side render

With server side rendering, the react front-end is rendered on the server on the initial GET request. During that step the api host is collected from the environment variable and inserted to the rendered application as props.

Obviously server side rendering is good for performance as well as find ability by the search engine crawlers.
