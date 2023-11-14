FROM python:3.9
ARG TOKEN
RUN apt update && apt install nginx git -y

RUN mkdir -p /root/.pip
ADD pip.conf /root/.pip/pip.conf
ENV PYTHONPATH=/app:${PYTHONPATH}
ENV PATH=/app:${PATH}

RUN mkdir -p /app/service/helpers
RUN mkdir -p /app/service/data/shapefiles

WORKDIR /app/service

ADD setup.py README.md /app/service/
ADD helpers/gadm_geojson_converter.py /app/service/helpers
ADD helpers/serialize_files.py /app/service/helpers
ADD helpers/downloadGeoJson.sh /app/service/helpers

RUN pip install -e .[production]

## Download geoJSON from GADM and and property update
RUN chmod a+x ./helpers/downloadGeoJson.sh
RUN ./helpers/downloadGeoJson.sh

WORKDIR /app

ADD nginx.conf /etc/nginx/nginx.conf
ADD entrypoint.sh .
RUN chmod +x ./entrypoint.sh
ADD wsgi.ini .
ADD . ./service

CMD ["uvicorn", "service.app:app", "--host", "0.0.0.0", "--port", "5000"]
