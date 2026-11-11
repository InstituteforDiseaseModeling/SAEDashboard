FROM python:3.13-slim AS builder

WORKDIR /build
COPY service/scripts/download_gadm.py /build/service/scripts/
COPY service/scripts/gadm_name_lookup.json /build/service/scripts/
COPY service/scripts/build_shape_pickles.py /build/service/scripts/

ARG GADM_VERSION=latest
RUN --mount=type=cache,target=/build/service/data/gadm \
    python /build/service/scripts/download_gadm.py --version $GADM_VERSION && \
    python /build/service/scripts/build_shape_pickles.py

FROM python:3.13-slim

WORKDIR /app

COPY service/requirements.txt /app/service/requirements.txt
RUN pip install --upgrade "pip>=26.2.2" && pip install --no-cache-dir -r /app/service/requirements.txt

COPY service/ /app/service/
COPY --from=builder /build/service/data/shapefiles/ /app/service/data/shapefiles/

ENV PYTHONPATH=/app:${PYTHONPATH}

CMD ["uvicorn", "service.app:app", "--host", "0.0.0.0", "--port", "5000"]
