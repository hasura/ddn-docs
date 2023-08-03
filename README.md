# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

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

**Until 10 August 👇**

This is the 🤠 Wild West 🤠. You can commit directly to `main` and push to `origin`. No PRs required. Why are we doing this?
Speed. We want to get as much content in as quickly as possible without a docs' review blocking this work. Starting on
11 August, we'll disable direct commits to `main` and require PRs. On this date we'll begin reshaping and cleaning up
existing content; if there's more that needs to be added after that date, you'll have to open a PR.

**NB: PLEASE, before committing, test the build and ensure your changes don't break the site.**

You can test by running:

`yarn build`

Then, after it builds without error, run:

`yarn serve`

If things appear as you expect, you're good to go.

**After 10 August 👇**

We'll use our normal contribution process:

1. Create a new branch in the format of `docs/<your-name>/<branch-name>`
2. Share your brilliance
3. Open a PR against `main`
4. Our CI will tag either Sean or Rob to review your PR
5. You're used to the flow from here ☝️
