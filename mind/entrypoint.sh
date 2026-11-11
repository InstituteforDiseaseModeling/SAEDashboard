#!/bin/bash
mkdir -p /data/indicators /data/uploads /data/sessions /data/tmp /data/shapefiles /data/settings

# local docker-compose scenario only
if [ -d /app/service-indicators-source ]; then
    for csv in /app/service-indicators-source/*.csv; do
        [ -f "$csv" ] || continue
        fname=$(basename "$csv")
        if [ ! -f "/data/indicators/$fname" ]; then
            cp "$csv" /app/manually-added-indicators/
        fi
    done
fi

exec uvicorn app:app --host 0.0.0.0 --port 5020
