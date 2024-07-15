# Start with a container aliased as a a builder
# We use this container to build ONLY
# After we build, we copy the final build artifacts
# to an NGINX image
FROM node:20 as builder

# set working directory
RUN mkdir /app/
WORKDIR /app


COPY yarn.lock /app/yarn.lock
COPY package.json /app/package.json
RUN yarn global add react-scripts 
RUN yarn --loglevel=error 
ADD public /app/public
ADD src /app/src
RUN ls /app
RUN yarn run build -p

## Final Image
FROM nginx
HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl -f http://localhost || exit 1

COPY nginx.conf /etc/nginx/nginx.conf
COPY site.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
