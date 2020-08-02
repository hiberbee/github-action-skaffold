FROM docker.io/alpine:3.12
WORKDIR /usr/local/src
ARG skaffold_version=1.13.0
ARG container_structure_test_version=1.8.0
ADD https://storage.googleapis.com/skaffold/releases/v${skaffold_version}/skaffold-linux-amd64 skaffold
ADD https://storage.googleapis.com/container-structure-test/v${container_structure_test_version}/container-structure-test-linux-amd64 container-structure-test
RUN chmod +x skaffold \
 && chmod +x container-structure-test
COPY skaffold.yaml Dockerfile ./
ENTRYPOINT ["skaffold"]
CMD ["init"]
