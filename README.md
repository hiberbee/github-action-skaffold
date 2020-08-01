# Skaffold Build Action

![License](https://img.shields.io/github/license/hiberbee/github-action-skaffold?style=flat-square)

![Docker Build](https://img.shields.io/docker/cloud/build/hiberb/skaffold?label=Docker%20Hub&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hiberbee/github-action-skaffold/Skaffold?label=Github%20Actions&style=flat-square)

![Docker Tag](https://img.shields.io/docker/v/hiberb/skaffold?label=hiberb%2Fskaffold&style=flat-square)
![Github Workflow](https://img.shields.io/github/v/tag/hiberbee/github-action-skaffold?label=hiberbee%2Fgithub-action-skaffold&style=flat-square)

Skaffold is a command line tool that facilitates continuous development for Kubernetes applications. You can iterate on your application source code locally then deploy to local or remote Kubernetes clusters. Skaffold handles the workflow for building, pushing and deploying your application. It also provides building blocks and describe customizations for a CI/CD pipeline.

This action allows you to execute skaffold commands as Github Action. Repository is self-testable, so you can refer to [Skaffold manifest](skaffold.yaml), [Container Structure tests](structure-test.yaml) and [Github workflow](.github/workflows/skaffold.yml)

## Installed software

- skaffold 1.13.0
- container-structure-test 1.8.0

## Inputs


| Name | Description | Default |
| ---- | ----------- | ------- |
| `version` | Set Skaffold version | 1.13.0 |
| `container-structure-test-version` | Set Container Structure Test version | 1.8.0 |
| `profile` | Set Skaffold profile name |  |
| `build-image` | Set Skaffold profile name |  |

## Outputs

### Example

```yaml
name: Skaffold
on: [push]
jobs:
  run:
    name: Run full pipiline
    runs-on: ubuntu-latest
    steps:
      - name: Checkout sources
        uses: actions/checkout@v2

      - name: Setup Minikube
        uses: hiberbee/github-action-minikube@master

      - name: Add Helm stable repository
        run: |
          helm repo add bitnami https://charts.bitnami.com/bitnami
          helm repo update

      - name: Run Skaffold CI
        uses: hiberbee/github-action-skaffold@master
        with:
          command: run

      - name: Check Wordpress service
        run: kubectl get services
```
