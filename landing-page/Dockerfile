FROM trion/ng-cli-karma:18.2.11 AS node-builder
WORKDIR /src
COPY ./package*.json ./
RUN npm install --ignore-scripts --force
COPY ./src/ .

FROM node-builder as ng-builder
RUN npm run build -- --configuration production
RUN ls -lstra dist

FROM caddy:2-builder AS builder
RUN xcaddy build \
    --with github.com/caddyserver/replace-response

FROM caddy:2 as final
RUN chmod +rw /config/caddy
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder src/dist/ /site
EXPOSE 2015 2016
