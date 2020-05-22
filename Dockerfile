ARG docker_version=19.03.9
ARG alpine_version=3.11.6
FROM docker.io/docker:${docker_version} AS docker-image
FROM docker.io/alpine:${alpine_version} AS alpine-image

FROM alpine-image AS binaries
WORKDIR /workdir
ARG skaffold_version=1.10.1
ARG container_structure_test_version=1.8.0
COPY --from=docker-image /usr/local/bin/docker docker
ADD https://storage.googleapis.com/skaffold/releases/v${skaffold_version}/skaffold-linux-amd64 skaffold
ADD https://storage.googleapis.com/container-structure-test/v${container_structure_test_version}/container-structure-test-linux-amd64 container-structure-test
RUN chmod -R +x /workdir
ENTRYPOINT ["skaffold"]

FROM scratch
WORKDIR /usr/local/bin
COPY --from=binaries /workdir/ ./
ENTRYPOINT ["skaffold"]
