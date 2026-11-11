# SAEDashboard

Three-service stack: React client, FastAPI service, mind AI agent (using mind-core wheel).

## Commands

### Docker (full stack)
```
docker compose up --build          # start all services
docker compose down                # stop
```

### Local development
```
# Service (port 5000)
PYTHONPATH=. .venv/bin/python -m uvicorn service.app:app --host 0.0.0.0 --port 5000

# Client (port 3000)
cd client && yarn && yarn start

# Mind (port 5020) — requires mind-core wheel installed
cd mind && pip install -r requirements.txt
PYTHONPATH=. SERVICE_URL=http://localhost:5000 uvicorn app:app --host 0.0.0.0 --port 5020
```

## Architecture

- **client/** — React 18, MUI, Redux, Leaflet maps. Proxies `/api/*` → service:5000, `/mind/*` → mind:5020
- **service/** — FastAPI. CSV-based data store. Controllers: config, map, indicators, timeseries, shapes, register, etc.
- **mind/** — FastAPI AI agent. Uses mind-core wheel for onboarding + analytical workflows. Registers indicators with service via HTTP callbacks.

## Ports
- client: 8080 (nginx) or 3000 (dev)
- service: 5000
- mind: 5020

## Key conventions
- Geographic IDs: colon-separated dot-names (`Africa:Senegal:Diourbel`)
- CSV naming: `{Country}__{Indicator}__{Subgroup}__{Version}.csv`
- Shapefile naming: `{Country}__l{AdminLevel}__{Version}.shp.pickle`
- Config: `service/app_config.json` (static indicators), `service/data/indicator_metadata.json` (dynamic)
- Use pathlib.Path, never os.path
