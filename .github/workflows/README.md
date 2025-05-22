# Testing Connector DRI PR Reviewer Workflow

This directory contains files for testing the Connector DRI PR Reviewer workflow locally using nektos/act and VS Code
GitHub Actions extension.

## Prerequisites

1. Install nektos/act:

   ```bash
   brew install act  # For macOS
   ```

2. Install VS Code GitHub Actions extension

3. Set up your GitHub token:
   - Create a Personal Access Token with `repo` scope
   - Update `.github/workflows/test-secrets/.secrets` with your token

## Test Files Structure

```
.github/workflows/
├── connector-dri-pr-reviewer.yml  # Main workflow file
├── test-events/
│   └── pull_request.json         # Test event payload
├── test-secrets/
│   └── .secrets                  # Local secrets file
├── test-data/
│   ├── dri-lookup-response.json  # Mock DRI API response
│   └── changed-files.json        # Mock changed files response
└── README.md                     # This file
```

## Running Tests Locally

### Using nektos/act

1. From the repository root, run:
   ```bash
   act pull_request_target \
     -e .github/workflows/test-events/pull_request.json \
     -s DOCS_GITHUB_TOKEN="$(cat .github/workflows/test-secrets/.secrets | grep DOCS_GITHUB_TOKEN | cut -d'=' -f2)" \
     --workflows .github/workflows/connector-dri-pr-reviewer.yml \
     -v
   ```

For more detailed output, add these flags:

```bash
   --artifact-server-path /tmp/artifacts \
   --env-file .github/workflows/test-secrets/.secrets \
   -P ubuntu-latest=nektos/act-environments-ubuntu:18.04
```

### Using VS Code GitHub Actions Extension

1. Open the command palette (Cmd/Ctrl + Shift + P)
2. Search for "GitHub Actions: Run Workflow"
3. Select "connector-dri-pr-reviewer.yml"
4. Use the provided test event payload

## Test Data and Mocks

### Pull Request Event

The test event in `test-events/pull_request.json` simulates a PR that:

- Changes a PostgreSQL connector documentation file
- Is opened against the main branch
- Has a specific PR number and commit SHA

### DRI API Mock

The `test-data/dri-lookup-response.json` mocks the DRI lookup API response with:

- A test DRI for the PostgreSQL connector
- Sample contact information

### Changed Files Mock

The `test-data/changed-files.json` mocks the changed files action output with:

- A single modified file in the PostgreSQL connector docs
- All necessary file status fields

## Expected Behavior

The workflow should:

1. Detect changes to connector documentation files
2. Query the DRI lookup API for each changed connector
3. Request reviews from the identified DRIs

## Troubleshooting

1. If the workflow fails with permission errors:

   - Check your GitHub token permissions
   - Ensure the token is correctly set in the .secrets file
   - Token needs at least `repo` and `pull_request` scopes

2. If the DRI lookup fails:

   - Verify the API endpoint is accessible
   - Check the connector folder name matches the registry
   - Verify the mock data in test-data/dri-lookup-response.json

3. For act-specific issues:

   - Run with `-v` flag for verbose output
   - Check if required actions are available in the runner
   - Try using a specific Ubuntu runner image
   - Check the artifacts directory for logs

4. Common Issues:
   - Missing or invalid GitHub token
   - Incorrect file paths in changed files mock
   - Network access to API endpoints
   - Docker daemon not running (required by act)

## Security Notes

- Never commit the `.secrets` file
- Keep test data separate from production
- Use mock data for sensitive information
- The test directory is git-ignored by default
