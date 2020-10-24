ARG NODE_IMAGE

FROM ${NODE_IMAGE}

WORKDIR /services/api

COPY . .

RUN yarn

RUN yarn prod
