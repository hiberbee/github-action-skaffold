FROM alpine:3.12
WORKDIR /usr/local/bin
ARG skaffoldVersion=1.12.0
ARG containerStructureTestVersion=1.8.0
ADD https://storage.googleapis.com/skaffold/releases/v${skaffoldVersion}/skaffold-linux-amd64 skaffold
ADD https://storage.googleapis.com/container-structure-test/v${containerStructureTestVersion}/container-structure-test-linux-amd64 container-structure-test
COPY --from=docker /usr/local/bin/docker .
RUN chmod -R +x /usr/local/bin
ENTRYPOINT ["skaffold"]
