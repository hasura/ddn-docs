FROM --platform=linux/amd64 node:17-alpine

ENV release_mode="production"

ENV BUILD_VERSION="2.0"

RUN apk add --update git \
    bash \
    yarn

RUN sh -c 'echo -e "Updated at: 2023-06-13 12:12:12 UTC"'
RUN git clone https://github.com/hasura/docs-v3.git --single-branch --depth 1 graphql-engine

WORKDIR /

# EDIT TIMESTAMP FOR DEPLOYING PRODUCTION DOCS (Doesn't need to be accurate)
RUN sh -c 'echo -e "Updated at: 2023-06-13 12:12:12 UTC"'
# EDIT OVER

RUN git pull

RUN yarn

# Bundle app source

RUN yarn run build

CMD ["yarn", "run", "serve", "-p", "8080", "--host", "0.0.0.0"]