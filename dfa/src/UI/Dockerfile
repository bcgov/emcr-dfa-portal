# --- Build Arguments (Global) ---
# Defaults allow local builds without args; GitHub Actions overrides with real values
ARG BUILD_IMAGE_NAME=local
ARG BUILD_VERSION=local

# We need to use a specific tag and not the latest for the base docker image
# This is to keep node and npm versions in sync
# trion/ng-cli-karma:19.2.6
#             node version 22.14.0
#             npm version 10.9.2
FROM trion/ng-cli-karma:19.2.6 AS node-builder
WORKDIR /src

# Copy and install shared library dependencies, then build it
COPY shared-workspace/package*.json shared-workspace/
WORKDIR /src/shared-workspace
RUN npm install
COPY shared-workspace/ ./
RUN npx ng build shared-ui

# Copy app package.json and install dependencies (shared-ui now exists)
WORKDIR /src/dfa/src/UI/embc-dfa
COPY dfa/src/UI/embc-dfa/package*.json ./
RUN npm install --ignore-scripts

# Copy app source
COPY dfa/src/UI/embc-dfa/ ./

FROM node-builder as ng-builder
#RUN npm run test -- --no-watch --no-progress
RUN npm run build -- --configuration production
RUN ls -lstra dist

FROM caddy:2-builder AS builder
RUN xcaddy build \
    --with github.com/caddyserver/replace-response

FROM caddy:2 as final
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION
# API_URL gets replaced at deployment time
# ENV API_URL=http://localhost:5020
ENV API_URL=http://host.containers.internal:5020

# Set environment variables for traceability
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}
ENV BUILD_VERSION=${BUILD_VERSION}
RUN chmod +rw /config/caddy
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY dfa/src/UI/Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder src/dfa/src/UI/embc-dfa/dist/embc-dfa /site

# Use if you need to run the container in your local dev setup
RUN mkdir -p /site/env && echo '{ \
    "envName": "local", \
    "bannerTitle": "You are in the **LOCAL** version of the **Disaster Financial Assistance Tool**.", \
    "bannerSubTitle": "All information entered here will be treated as **LOCAL** data.", \
    "bannerColor": "#097d8c" \
    }' > /site/env/info.json

EXPOSE 2015 2016
