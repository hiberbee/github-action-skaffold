FROM alpine:3.11.6
WORKDIR /usr/local/bin
ARG skaffold_version=1.10.1
ARG container_structure_test_version=1.8.0
COPY --from=docker /usr/local/bin/docker docker
ADD https://storage.googleapis.com/skaffold/releases/v${skaffold_version}/skaffold-linux-amd64 skaffold
ADD https://storage.googleapis.com/container-structure-test/v${container_structure_test_version}/container-structure-test-linux-amd64 container-structure-test
RUN chmod -R +x /usr/local/bin
ENTRYPOINT ["skaffold"]
