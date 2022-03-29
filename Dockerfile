FROM node:12

WORKDIR /app

ARG NODE_APP_INSTANCE
ARG DOCKER_ENV

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_APP_INSTANCE=${NODE_APP_INSTANCE:-mothership}
ENV NODE_ENV=${DOCKER_ENV:-stage}

COPY package*.json ./

RUN npm ci

COPY . .

RUN ["npm", "run", "build"]

EXPOSE 3800

CMD ["node", "build/server/index.js"]