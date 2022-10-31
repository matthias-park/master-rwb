FROM node:15

WORKDIR /app

ARG DOCKER_ENV

ENV BUILD_ALL_APPS=true
ENV NODE_ENV=${DOCKER_ENV:-stage}
COPY package*.json ./

RUN npm ci

COPY . .

RUN ["npm", "run", "build"]

EXPOSE 3800

CMD ["node", "build/server/index.js"]