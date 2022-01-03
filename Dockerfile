FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3800

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}

RUN echo your NODE_ENV for dev is $NODE_ENV
RUN echo 'fs.inotify.max_user_watches=524288' >> /etc/sysctl.conf
RUN sudo sysctl -p
CMD [ "npm", "start" ]