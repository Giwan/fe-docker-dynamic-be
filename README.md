# React frontend hosted in docker with a variable backend

## The backend is determined on docker run

At edia we needed a template that would allow us to host our front-end application in docker while still allowing for various backends to be provided.
In some cases the backend would be on the same host as the frontend while on others these could be completely different.

The following describes the details of this template and how it is constructed.
