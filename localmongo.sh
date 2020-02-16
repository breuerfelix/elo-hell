#!/bin/bash
podman run -p 27017:27017 --name elo-mongo -v ${PWD}/elo-db:/data/db --rm mongo:latest
