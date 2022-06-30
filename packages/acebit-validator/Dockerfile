FROM node:16.13.0 as build-stage

WORKDIR /app
RUN chmod 755 /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY . .

RUN yarn install && yarn build

FROM nginx:1.15

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build-stage /app/build .
# Containers run nginx with global directives and daemon off

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]