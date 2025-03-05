# GitHub Actions workflows

## Building images
Images are built when pull requests are merged into the `support-develop`/`main` branch. The following table identifies which workflows belong to which respective image that is built.

| Workflow Dispatched                  | Workflow File                       | Image Built              |
| ------------------------------------ | ----------------------------------- | ------------------------ |
| DFA PDF - Build PDF Image            | `dfa-pdf-build.yaml`                | `dfa-portal-pdf-service` |
| DFA Private Portal - Build API Image | `dfa-private-portal-build-api.yaml` | `dfa-portal-api`         |
| DFA Private Portal - Build UI Image  | `dfa-private-portal-build-ui.yaml`  | `dfa-portal-ui`          |
| DFA Public Portal - Build API Image  | `dfa-public-portal-build-api.yaml`  | `dfa-portal-api-public`  |
| DFA Public Portal - Build UI Image   | `dfa-public-portal-build-ui.yaml`   | `dfa-portal-ui-public`   |

Image building and pushing occurs via Docker's [`build-push-action`](https://github.com/marketplace/actions/build-and-push-docker-images).

## Promoting images
To promote images through their respective subsequent environments, please utilise the table to identify which workflows to run.

| Image                    | Environment to Promote To | Workflow to Dispatch                       |
| ------------------------ | ------------------------- | ------------------------------------------ |
| `dfa-portal-api`         | Test                      | DFA Private Portal - Promote to Test       |
| `dfa-portal-api`         | Training                  | DFA Private Portal - Promote to Training   |
| `dfa-portal-api`         | Production                | DFA Private Portal - Promote to Production |
| `dfa-portal-ui`          | Test                      | DFA Private Portal - Promote to Test       |
| `dfa-portal-ui`          | Training                  | DFA Private Portal - Promote to Training   |
| `dfa-portal-ui`          | Production                | DFA Private Portal - Promote to Production |
| `dfa-portal-api-public`  | Test                      | DFA Public Portal - Promote to Test        |
| `dfa-portal-api-public`  | Training                  | DFA Public Portal - Promote to Training    |
| `dfa-portal-api-public`  | Production                | DFA Public Portal - Promote to Production  |
| `dfa-portal-ui-public`   | Test                      | DFA Public Portal - Promote to Test        |
| `dfa-portal-ui-public`   | Training                  | DFA Public Portal - Promote to Training    |
| `dfa-portal-ui-public`   | Production                | DFA Public Portal - Promote to Production  |
| `dfa-portal-pdf-service` | Test                      | DFA PDF - Promote to Test                  |
| `dfa-portal-pdf-service` | Training                  | DFA PDF - Promote to Training              |
| `dfa-portal-pdf-service` | Production                | DFA PDF - Promote to Production            |