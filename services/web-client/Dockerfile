ARG NODE_IMAGE

FROM ${NODE_IMAGE}

WORKDIR /services/web-client

COPY . .

RUN yarn

RUN yarn prod
