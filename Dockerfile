#
# First stage: 
# Building a frontend.
#

FROM alpine:3.17 AS frontend

# Move to a working directory (/static).
WORKDIR /static

# https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported
ENV NODE_OPTIONS=--openssl-legacy-provider
# Install npm (with latest nodejs) and yarn (globally, in silent mode).
RUN apk add --update nodejs npm && \
    npm i -g -s --unsafe-perm yarn

# Copy only ./ui folder to the working directory.
COPY ui .

# Run yarn scripts (install & build).
RUN yarn install && yarn build

#
# Second stage: 
# Building a backend.
#

FROM golang:1.18-alpine AS backend

# Move to a working directory (/build).
WORKDIR /build

# Copy and download dependencies.
COPY go.mod go.sum ./
RUN go mod download

# Copy a source code to the container.
COPY . .

# Copy frontend static files from /static to the root folder of the backend container.
COPY --from=frontend ["/static/build", "ui/build"]

# Set necessary environmet variables needed for the image and build the server.
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64

# Run go build (with ldflags to reduce binary size).
RUN go build -ldflags="-s -w" -o asynqmon ./cmd/asynqmon

#
# Third stage: 
# Creating and running a new scratch container with the backend binary.
#

FROM scratch

# Copy binary from /build to the root folder of the scratch container.
COPY --from=backend ["/build/asynqmon", "/"]

# Command to run when starting the container.
ENTRYPOINT ["/asynqmon"]
