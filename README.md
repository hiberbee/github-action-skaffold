# Skaffold Github Action

![License](https://img.shields.io/github/license/hiberbee/github-action-skaffold?style=flat-square)

![Docker Build](https://img.shields.io/docker/cloud/build/hiberb/skaffold?label=Docker%20Hub&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hiberbee/github-action-skaffold/Skaffold?label=Github%20Actions&style=flat-square)

![Docker Tag](https://img.shields.io/docker/v/hiberb/skaffold?label=hiberb%2Fskaffold&style=flat-square)
![Github Workflow](https://img.shields.io/github/v/tag/hiberbee/github-action-skaffold?label=hiberbee%2Fgithub-action-skaffold&style=flat-square)

Skaffold is a command line tool that facilitates continuous development for Kubernetes applications. You can iterate on your application source code locally then deploy to local or remote Kubernetes clusters. Skaffold handles the workflow for building, pushing and deploying your application. It also provides building blocks and describe customizations for a CI/CD pipeline.

This action allows you to execute skaffold commands as Github Action. Repository is self-testable, so you can refer to [Skaffold manifest](skaffold.yaml), [Container Structure tests](structure-test.yaml) and [Github workflow](.github/workflows/skaffold.yml)

See also [Github Action Minikube](https://github.com/hiberbee/github-action-minikube) for better development experience

## Installed versions

- skaffold 1.13.2
- container-structure-test 1.9.0

### Configuration

| Name | Description | Default |
| ---- | ----------- | ------- |
| `skaffold-version` | Set Skaffold version | 1.13.2 |
| `container-structure-test-version` | Set Container Structure Test version | 1.9.0 |

## Inputs

### Required

| Name | Description | Default |
| ---- | ----------- | ------- |
| `command` | Set Skaffold profile name |  |

### Optional

| Name | Description | Default |
| ---- | ----------- | ------- |
| `build-image` | Set Skaffold profile name | n/a |
| `cache-artifacts` | Set Skaffold profile name | true |
| `default-repo` | Default repository value (overrides global config) | n/a |
| `filename` | Path or URL to the Skaffold config file | skaffold.yaml |
| `namespace` | Run deployments in the specified namespace | n/a |
| `kube-context` | Deploy to this Kubernetes context | n/a |
| `kubeconfig` | Path to the kubeconfig file to use for CLI requests | n/a |
| `profile` | Activate profiles by name | n/a |
| `tag` | Set Skaffold profile name | n/a |

## Outputs

### Example

```yaml
name: Skaffold
on: [push]
jobs:
  run:
    name: Run Pipiline
    runs-on: ubuntu-20.04
    steps:
      - name: Extract cache
        uses: actions/cache@v2
        with:
          path: ~/.skaffold/cache
          key: ${{ runner.os }}-skaffold-1.13.2
          restore-keys: ${{ runner.os }}-skaffold-

      - name: Checkout sources
        uses: actions/checkout@v2

      - name: Start Minikube
        uses: hiberbee/github-action-minikube@latest

      - name: Authenticate with Docker registry
        run: echo $GITHUB_TOKEN | docker login docker.pkg.github.com -u ${{ github.actor }} --password-stdin
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Add Helm repositories
        run: helm repo --repository-config=repositories.yaml update

      - name: Run Skaffold command
        uses: hiberbee/github-action-skaffold@latest
        with:
          command: run
          default-repo: docker.pkg.github.com/${{ github.repository }}

      - name: Check deployed service
        run: kubectl get services

```
