#!/bin/bash

# Wait for data sync to complete (when deploying to AKS)
# shapes_dir="/app/service/data/$([[ -n $SAE_AKS ]] && echo latest)/shapefiles"
# for i in {1..8}; do
#   [[ -d "${shapes_dir}" ]] && break
#   sleep 15 && echo "WARNING: Shapes dir not found, retrying (${i})..."
# done

# [[ ! -d "${shapes_dir}" ]] && { echo "ERROR: Shapes dir not found, exiting..."; exit 125; }

if [ "$DEBUG" = "1" ]; then
    echo "Running Flask Debug Server"
    export PYTHONPATH=/app
    cd /app
    python service/app.py manage run
else
    echo "Launching Nginx"
    cd /app
    uwsgi --ini /app/wsgi.ini &
    nginx
    tail -f /var/log/nginx/*
fi