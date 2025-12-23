# --- Build Arguments (Global) ---
# Defaults allow local builds without args; GitHub Actions overrides with real values
ARG BUILD_IMAGE_NAME=local
ARG BUILD_VERSION=local

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENV DOTNET_gcServer=1

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all directories at once
COPY ["dfa/src/API/", "dfa/src/API/"]
COPY ["shared/src/", "shared/src/"]

# Build and publish
WORKDIR /src/dfa/src/API
RUN dotnet sln EMBC.DFA.sln remove /src/shared/src/EMBC.Database.Test/EMBC.Database.Test.csproj || true
RUN dotnet restore EMBC.DFA.sln
RUN dotnet publish "EMBC.DFA.API/EMBC.DFA.API.csproj" -c Release -o /app/publish --runtime linux-musl-x64 --no-self-contained

# Final stage
FROM base AS final
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION
WORKDIR /app
COPY --from=build /app/publish .

# Set environment variables for traceability
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}
ENV BUILD_VERSION=${BUILD_VERSION}

ENTRYPOINT ["dotnet", "EMBC.DFA.API.dll"]
