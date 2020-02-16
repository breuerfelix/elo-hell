#!/bin/bash
podman run -p 27017:27017 --name elo-mongo --rm mongo:latest
