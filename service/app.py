import uvicorn
from fastapi import FastAPI
from service.controllers import africa_map, map, dot_names, indicators, subgroups, timeseries, shapes, years, events, \
    health_clinics

app = FastAPI()

app.include_router(africa_map.router)
app.include_router(dot_names.router)
app.include_router(map.router)
app.include_router(indicators.router)
app.include_router(shapes.router)
app.include_router(subgroups.router)
app.include_router(timeseries.router)
app.include_router(years.router)
app.include_router(events.router)
app.include_router(health_clinics.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run(app, host='127.0.0.1', port=5000)
