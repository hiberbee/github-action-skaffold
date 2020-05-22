# Skaffold Build Action

![License](https://img.shields.io/github/license/hiberbee/actions.skaffold?style=flat-square)

![Docker Build](https://img.shields.io/docker/cloud/build/hiberb/skaffold?label=Docker%20Build&style=flat-square)
![Docker Tag](https://img.shields.io/docker/v/hiberb/skaffold?label=hiberb%2Fskaffold&style=flat-square)

![Skaffold](https://img.shields.io/github/workflow/status/hiberbee/actions.skaffold/Skaffold?label=Github%20Workflow&style=flat-square) 
![Github Workflow](https://img.shields.io/github/v/tag/hiberbee/actions.skaffold?label=hiberbee%2Factions.skaffold&style=flat-square)

Skaffold is a command line tool that facilitates continuous development for Kubernetes applications. You can iterate on your application source code locally then deploy to local or remote Kubernetes clusters. Skaffold handles the workflow for building, pushing and deploying your application. It also provides building blocks and describe customizations for a CI/CD pipeline.

This action allows you to execute `build` and `test` stages of Skaffold CI/CD pipeline. Repository is self-testable, so you can refer to [Skaffold manifest](skaffold.yaml), [Container Structure tests](container-structure-test.yaml) and [Github workflow](.github/workflows/skaffold.yml)

### Example

```yaml
name: Skaffold Pipiline
on: [push]
env:
  DOCKER_REGISTRY: docker.pkg.github.com/hiberbee/actions
jobs:
  build:
    name: Build & Test Docker images
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository sources
        uses: actions/checkout@v2

      - name: Authenticate with Docker credentials
        uses: azure/docker-login@v1
        with:
          login-server: $DOCKER_REGISTRY
          username: ${{ github.actor }}
          password: ${{ secrets.docker_password }}

      - name: Get Skaffold version
        uses: hiberbee/actions.skaffold@master
        with:
          args: version
          default-repo: $DOCKER_REGISTRY

      - name: Build Skaffold artifacts
        uses: hiberbee/actions.skaffold@master
        with:
          args: build

      - name: Test container structure
        uses: hiberbee/actions.skaffold@master
        with:
          entrypoint: container-structure-test
          args: test --config container-structure-test.yaml --image skaffold

```
