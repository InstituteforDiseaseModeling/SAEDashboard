FROM node:22.23.4-slim as builder

RUN mkdir /app/
WORKDIR /app

COPY yarn.lock /app/yarn.lock
COPY package.json /app/package.json
RUN yarn global add react-scripts
RUN yarn --loglevel=error
ADD public /app/public
ADD src /app/src
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN yarn run build -p

## Final Image
FROM nginx

ARG SITE_CONF=site.conf
HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl -f http://localhost || exit 1

COPY nginx.conf /etc/nginx/nginx.conf
COPY ${SITE_CONF} /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
