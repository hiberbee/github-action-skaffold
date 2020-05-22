# Skaffold Build Action

## Examples

Essential configuration

```yaml
name: skaffold
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: hiberbee/actions.skaffold@master
        with:
          command: build
```
