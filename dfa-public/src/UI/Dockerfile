# --- Build Arguments (Global) ---
# Defaults allow local builds without args; GitHub Actions overrides with real values
ARG BUILD_IMAGE_NAME=local
ARG BUILD_VERSION=local

# We need to use a specific tag and not the latest for the base docker image
# This is to keep node and npm versions in sync
# trion/ng-cli-karma:19.2.14
#             node version 22.14.0
#             npm version 10.9.2
FROM trion/ng-cli-karma:19.2.13 AS node-builder
WORKDIR /src
COPY ./embc-dfa/package*.json ./
RUN npm install --ignore-scripts --force
COPY ./embc-dfa/ .

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
ENV API_URL=http://host.containers.internal:5020

# Set environment variables for traceability
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}
ENV BUILD_VERSION=${BUILD_VERSION}
RUN chmod +rw /config/caddy
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder src/dist/embc-dfa /site
EXPOSE 2015 2016
