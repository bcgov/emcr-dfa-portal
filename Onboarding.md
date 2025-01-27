# DFA Portal Developer Documentation

## Overview

The DFA (Disaster Financial Assistance) Portal consists of two separate projects:

1. **DFA Private Sector Portal**
   - Serves homeowners, residential tenants, small businesses, farms, and charitable organizations
   - Located in the `dfa/` directory

2. **DFA Public Sector Portal**
   - Serves Indigenous communities and local governments
   - Located in the `dfa-public/` directory

Both projects share similar setup requirements and architecture.

## Development Environment Setup

### Prerequisites

- Node Version Manager (nvm)
- Node.js 20.14.0
- Angular CLI 18.0.4
- pnpm
- .NET Core 6.0.x
- Visual Studio (for API development)
- Microsoft Edge (recommended browser for local development)

### Node.js Setup

Both portals use `trion/ng-cli-karma` as their base Docker image. To match the build environment:

```bash
nvm install 20.14.0
nvm use 20.14.0
```

### Global Dependencies

Install the required global packages:

```bash
npm install -g @angular/cli@18.0.4
npm install -g pnpm
```

## Project Structure

### DFA Private Sector Portal

```
dfa/
├── src/
│   ├── UI/
│   │   └── embc-dfa/      # Frontend application
│   └── API/
│       └── EMBC.DFA.API/  # Backend API
```

### DFA Public Sector Portal

```
dfa-public/
├── src/
│   ├── UI/
│   │   └── embc-dfa/          # Frontend application
│   └── API/
│       └── EMBC.DFA.PUBLIC.API/  # Backend API
```

## Frontend Development

### Running DFA Private Sector UI

1. Navigate to the frontend directory:
   ```bash
   cd dfa/src/UI/embc-dfa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   - With remote API:
     ```bash
     npm run start
     ```
   - With local API:
     ```bash
     npm run startlocal
     ```
     Note that when running `npm run startlocal`, the Angular application will use OpenAPI to automatically generate necessary TypeScript files based on the API specification.

### Running DFA Public Sector UI

1. Navigate to the frontend directory:
   ```bash
   cd dfa-public/src/UI/embc-dfa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   - With remote API:
     ```bash
     npm run start
     ```
   - With local API:
     ```bash
     npm run startlocal
     ```

## API Development

### Configuration

Both APIs require user secrets configuration for local development.

1. Configure user secrets:
   - Reference the structure from the Confluence page
   - Configuration details should be added using .NET User Secrets

### Running DFA Private Sector API

1. Navigate to the API directory:
   ```bash
   cd dfa/src/API/EMBC.DFA.API
   ```

2. Start the API in watch mode:
   ```bash
   dotnet watch
   ```

### Running DFA Public Sector API

1. Navigate to the API directory:
   ```bash
   cd dfa-public/src/API/EMBC.DFA.PUBLIC.API
   ```

2. Start the API in watch mode:
   ```bash
   dotnet watch
   ```

## Build Process

### CI/CD

- Both projects use GitHub Actions for CI/CD
- Builds are performed using Docker with `trion/ng-cli-karma` as the base image
- The build process automatically uses the latest version of `trion/ng-cli-karma`


