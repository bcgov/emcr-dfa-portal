# --- Build Arguments (Global) ---
# Defaults allow local builds without args; GitHub Actions overrides with real values
ARG BUILD_IMAGE_NAME=local
ARG BUILD_VERSION=local

FROM trion/ng-cli-karma:18.2.11 AS node-builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install --ignore-scripts --force
COPY ./ ./

FROM node-builder AS ng-builder
RUN npm run build -- --configuration production
RUN ls -lstra dist

FROM caddy:2-builder AS builder
RUN xcaddy build \
    --with github.com/caddyserver/replace-response

FROM caddy:2 AS final
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION

# Set environment variables for traceability
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}
ENV BUILD_VERSION=${BUILD_VERSION}

RUN chmod +rw /config/caddy
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /app/dist/ /site
EXPOSE 2015 2016
