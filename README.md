# Website

The docs site uses [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without
having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting
service.

### Contributing

Check out our contribution guide on the [wiki](https://hasura.io/docs/3.0/wiki/contributing/) 🤙

If you have any questions, reach out on Slack: [#team-docs](https://hasurahq.slack.com/archives/C015EA71MU0)

## Deployments

We have two environments: staging and production. We use GitHub Actions to deploy to both. Builds take, on average, 3-5
minutes.

Assuming you have the correct permissions, you can monitor builds on GCP
[here](https://console.cloud.google.com/cloud-build/builds;region=us-west2?project=websitecloud-352908).

### Staging

Upon a successful merge to `main`, a merge is automatically triggered by
[this GitHub Action](https://github.com/hasura/v3-docs/actions/workflows/merge-main-to-staging.yml) to `release-stage`.
GCP listens for pushes to this branch and, when one comes through, it builds and deploys the site to
[https://stage.hasura.io/docs/3.0](https://stage.hasura.io/docs/3.0).

### Production

We still have final control over when we deploy to production. To do so, we can use
[this GitHub Action](https://github.com/hasura/v3-docs/actions/workflows/merge-staging-to-prod.yml) to trigger a merge
to `release-prod`. GCP listens for pushes to this branch and, when one comes through, it builds and deploys the site to
[https://hasura.io/docs/3.0](https://hasura.io/docs/3.0).

To use this Action:

1. Head to [this Action](https://github.com/hasura/v3-docs/actions/workflows/merge-staging-to-prod.yml)
2. Click `Run workflow`
3. Choose `release-stage`
4. Click `Run workflow`

You can use the link above to check the build status. Then, monitor deployments to our clusters
[here](https://console.cloud.google.com/kubernetes/deployment/us-west2/prod-website-cloud-us-we2-gke-01/hasura/v3-docs-hasura/overview?project=websitecloud-352908).
