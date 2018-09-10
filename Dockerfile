# Use the following image to build this docker image
# This is pulled from docker.com and has everything
# needed to run a node project
FROM node:alpine

# Back_env is set during build
# telling the front-end which back-end
# it should be talking to
# ARG backend_env
# ENV BACKEND_ENV $backend_env
ENV PORT 3000

# Navigate (cd) to the app folder in the docker container
WORKDIR /usr/src/app

# Copy all package.json / package-lock.json etc. to the root folder
# this is executed on build: docker build .
COPY ./package*.json ./

RUN npm install

# copy everything from the external directory to the container folder in docker
COPY . .

# build the front-end with react build scripts and store them in the build folder
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
