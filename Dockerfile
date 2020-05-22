FROM alpine:latest
WORKDIR /usr/local/bin
ARG kubectl_version="1.18.0"
ARG skaffold_version="1.9.0"
ADD https://storage.googleapis.com/skaffold/releases/v${skaffold_version}/skaffold-linux-amd64 skaffold
ADD https://storage.googleapis.com/kubernetes-release/release/v${kubectl_version}/bin/linux/amd64/kubectl kubectl
ADD https://storage.googleapis.com/container-structure-test/latest/container-structure-test-linux-amd64 container-structure-test
RUN chmod -R +x /usr/local/bin
ENTRYPOINT ["skaffold"]
