FROM --platform=linux/amd64 node:18.14.2

ENV PORT=8080
# Create app directory
WORKDIR /

ENV release_mode="production"
ENV BUILD_VERSION="3.0"

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN yarn

# Bundle app source
COPY src /

# Build react/vue/angular bundle static files
RUN yarn run build


EXPOSE 8080

CMD ["yarn", "run", "serve", "-p", "8080", "--host", "0.0.0.0"]

