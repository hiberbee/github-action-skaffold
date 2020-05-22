ARG docker_version=19.03.9
FROM docker:${docker_version} AS docker

FROM alpine AS dependencies
WORKDIR /workdir
ARG skaffold_version=1.10.1
ARG container_structure_test_version=1.8.0
COPY --from=docker /usr/local/bin/docker docker
ADD https://storage.googleapis.com/skaffold/releases/v${skaffold_version}/skaffold-linux-amd64 skaffold
ADD https://storage.googleapis.com/container-structure-test/v${container_structure_test_version}/container-structure-test-linux-amd64 container-structure-test
RUN chmod -R +x /workdir
ENTRYPOINT ["skaffold"]

FROM scratch
WORKDIR /usr/local/bin
COPY --from=dependencies /workdir/ ./
ENTRYPOINT ["skaffold"]
