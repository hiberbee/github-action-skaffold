# Skaffold Build Action

![License](https://img.shields.io/github/license/hiberbee/github-action-skaffold?style=flat-square)

![Docker Build](https://img.shields.io/docker/cloud/build/hiberb/skaffold?label=Docker%20Hub&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hiberbee/github-action-skaffold/Skaffold%20Pipiline?label=Github%20Actions&style=flat-square)

![Docker Tag](https://img.shields.io/docker/v/hiberb/skaffold?label=hiberb%2Fskaffold&style=flat-square)
![Github Workflow](https://img.shields.io/github/v/tag/hiberbee/github-action-skaffold?label=hiberbee%2Fgithub-action-skaffold&style=flat-square)

Skaffold is a command line tool that facilitates continuous development for Kubernetes applications. You can iterate on your application source code locally then deploy to local or remote Kubernetes clusters. Skaffold handles the workflow for building, pushing and deploying your application. It also provides building blocks and describe customizations for a CI/CD pipeline.

This action allows you to execute `build` and `test` stages of Skaffold CI/CD pipeline. Repository is self-testable, so you can refer to [Skaffold manifest](skaffold.yaml), [Container Structure tests](structure-test.yaml) and [Github workflow](.github/workflows/skaffold.yml)

## Installed software

- docker 19.03.8
- skaffold 1.12.0
- container-structure-test 1.8.0

### Example

```yaml
name: Skaffold Pipiline
on: [push]
jobs:
  build:
    name: Build & Test Docker images
    runs-on: ubuntu-latest
    steps:
      - name: Checkout sources
        uses: actions/checkout@v2

      - name: Authenticate with Docker credentials
        run: echo ${{ secrets.DOCKER_PASSWORD }} | docker login --username ${{ secrets.DOCKER_USERNAME }} --password-stdin

      - name: Build Skaffold artifacts
        uses: hiberbee/github-action-skaffold@master
        with:
          default-repo: hiberb
          args: build

      - name: Test container structure
        uses: hiberbee/github-action-skaffold@master
        with:
          entrypoint: container-structure-test
          args: test --config structure-test.yaml --image hiberb/skaffold

      - name: Get Skaffold version
        uses: hiberbee/github-action-skaffold@master
        with:
          args: version

```
