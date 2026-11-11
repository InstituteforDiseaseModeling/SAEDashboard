FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY requirements.txt mind_core-0.1.0-py3-none-any.whl .
RUN uv pip install --system --no-cache -r requirements.txt

COPY *.py *.sh /app/
COPY controllers/ /app/controllers/
COPY workflow/ /app/workflow/

RUN chmod +x ./entrypoint.sh
RUN mkdir -p /app/manually-added-indicators

EXPOSE 5020
ENV PYTHONPATH="/app:${PYTHONPATH}"
ENV MANUAL_INDICATORS_DIR="/app/manually-added-indicators"
ENTRYPOINT ["./entrypoint.sh"]
