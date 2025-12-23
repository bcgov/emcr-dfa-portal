# --- Build Arguments (Global) ---
# Defaults allow local builds without args; GitHub Actions overrides with real values
ARG BUILD_IMAGE_NAME=local
ARG BUILD_VERSION=local

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
# install diagnostics tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src
COPY ["OAuthServer/OAuthServer.csproj", "OAuthServer/"]
COPY ["oauth-server.sln", ".editorconfig", "./"]
RUN dotnet restore .
COPY . .

# run unit tests
RUN dotnet test -c Release

# build
FROM build AS publish
RUN dotnet publish "OAuthServer/OAuthServer.csproj" -c Release -o /app/publish --runtime linux-x64 --no-self-contained

FROM base AS final
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION
# copy diagnostics tools
WORKDIR /tools
COPY --from=build /tools .
# copy app
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables for traceability
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}
ENV BUILD_VERSION=${BUILD_VERSION}

ENTRYPOINT ["dotnet", "OAuthServer.dll"]