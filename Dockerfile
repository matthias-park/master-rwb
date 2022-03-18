FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3800

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}

RUN echo your NODE_ENV for dev is $NODE_ENV

RUN echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

RUN cat /proc/sys/fs/inotify/max_user_watches

RUN fs.inotify.max_user_watches=524288

CMD [ "npm", "start" ]