# GitHub Actions workflows

## Building images
Images are built when pull requests are merged into the `support-develop`/`main` branch. The following table identifies which workflows belong to which respective image that is built.

| Workflow Dispatched      | Workflow File                | Image Built              |
| -------------------------| ---------------------------- | ------------------------ |
| Build PDF Service        | `cd-pdf-service.yaml`        | `dfa-portal-pdf-service` |
| Build Private Portal API | `cd-private-portal-api.yaml` | `dfa-portal-api`         |
| Build Private Portal UI  | `cd-private-portal-ui.yaml`  | `dfa-portal-ui`          |
| Build Public Portal API  | `cd-public-portal-api.yaml`  | `dfa-portal-api-public`  |
| Build Public Portal UI   | `cd-public-portal-ui.yaml`   | `dfa-portal-ui-public`   |

Image building and pushing occurs via Docker's [`build-push-action`](https://github.com/marketplace/actions/build-and-push-docker-images).

## Promoting images
To promote images through their respective subsequent environments, please utilise the table to identify which workflows to run.

| Image                    | Environment to Promote To | Workflow to Dispatch                 |
| ------------------------ | ------------------------- | ------------------------------------ |
| `dfa-portal-api`         | Test                      | Promote Private Portal to Test       |
| `dfa-portal-api`         | Training                  | Promote Private Portal to Training   |
| `dfa-portal-api`         | Production                | Promote Private Portal to Production |
| `dfa-portal-ui`          | Test                      | Promote Private Portal to Test       |
| `dfa-portal-ui`          | Training                  | Promote Private Portal to Training   |
| `dfa-portal-ui`          | Production                | Promote Private Portal to Production |
| `dfa-portal-api-public`  | Test                      | Promote Public Portal to Test        |
| `dfa-portal-api-public`  | Training                  | Promote Public Portal to Training    |
| `dfa-portal-api-public`  | Production                | Promote Public Portal to Production  |
| `dfa-portal-ui-public`   | Test                      | Promote Public Portal to Test        |
| `dfa-portal-ui-public`   | Training                  | Promote Public Portal to Training    |
| `dfa-portal-ui-public`   | Production                | Promote Public Portal to Production  |
| `dfa-portal-pdf-service` | Test                      | Promote PDF Service to Test          |
| `dfa-portal-pdf-service` | Training                  | Promote PDF Service to Training      |
| `dfa-portal-pdf-service` | Production                | Promote PDF Service to Production    |