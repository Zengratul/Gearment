# GitHub Actions CI/CD Pipeline

This GitHub Actions workflow is designed for **personal repositories** (not organization) and uses the default `GITHUB_TOKEN` to push Docker images to GitHub Container Registry (ghcr.io).

## Overview

The workflow consists of the following stages:

1. **Test**: Run unit tests and code coverage for both backend and frontend
2. **Build**: Build and push Docker images to GitHub Container Registry (ghcr.io)
3. **Security**: Security scan the built Docker images using Trivy
4. **Deploy**: Deploy to environments (dev/prod)

## Workflow Jobs

### Debug Pipeline

- Runs on all branches and pull requests
- Provides debugging information about the pipeline execution

### Test Jobs

- **test-backend**: Runs backend tests with coverage
- **test-frontend**: Runs frontend tests with coverage
- Both jobs use pnpm for dependency management and caching

### Build Jobs

- **build-backend**: Builds and pushes backend Docker image
- **build-frontend**: Builds and pushes frontend Docker image
- Uses Docker Buildx for efficient builds with caching
- Images are tagged with branch name, commit SHA, and latest

### Security Scan

- **security-scan**: Runs Trivy vulnerability scanner on both images
- Uploads results to GitHub Security tab
- Analyzes image sizes

### Deploy Jobs

- **deploy-dev**: Deploys to development environment (develop branch)
- **deploy-prod**: Deploys to production environment (main/master branch)

## Setup Requirements

### 1. Repository Settings

1. Go to your repository Settings > Actions > General
2. Enable "Read and write permissions" for Actions
3. Enable "Allow GitHub Actions to create and approve pull requests"

### 2. Environment Setup (Optional)

Create environments in your repository if you want to use deployment jobs:

1. Go to Settings > Environments
2. Create `development` environment
3. Create `production` environment
4. Add any required secrets for deployment

### 3. Container Registry Access

The workflow uses GitHub Container Registry (ghcr.io) with the default `GITHUB_TOKEN`. No additional setup is required for personal repositories.

**For Organization Repositories**: You'll need to create a Personal Access Token (PAT) with `write:packages` scope and add it as `GHCR_TOKEN` secret.

### 4. Required Secrets (Only for Deployment)

For deployment, you may need to add these secrets to your repository:

- `SSH_PRIVATE_KEY`: For SSH access to deployment servers
- `DEPLOY_HOST`: Deployment server hostname
- `DEPLOY_USER`: Deployment server username

## Configuration

### Environment Variables

The workflow uses these environment variables:

```yaml
REGISTRY_URL: ghcr.io
REGISTRY_IMAGE: ghcr.io/${{ github.repository }}
BACKEND_IMAGE: ghcr.io/${{ github.repository }}/backend
FRONTEND_IMAGE: ghcr.io/${{ github.repository }}/frontend
NEXT_PUBLIC_API_URL: https://gearment-be.minhviet.xyz/api
```

### Authentication Method

The workflow uses classic token authentication:

```yaml
permissions:
  contents: read
  packages: write
  id-token: write

# Login step uses GITHUB_TOKEN (classic token)
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

### Branch Protection

Consider setting up branch protection rules:

1. Go to Settings > Branches
2. Add rule for `main` and `master` branches
3. Enable "Require status checks to pass before merging"
4. Select the required status checks:
   - `test-backend`
   - `test-frontend`
   - `build-backend`
   - `build-frontend`
   - `security-scan`

## Usage

### Automatic Triggers

The workflow automatically runs on:

- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

### Manual Triggers

To manually trigger the workflow:

1. Go to Actions tab
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Customization

### Deployment Commands

Update the deployment jobs with your actual deployment commands:

```yaml
- name: Deploy to Development
  run: |
    ssh user@dev-server "cd /opt/gearment && \
    docker-compose pull && \
    docker-compose up -d"
```

### Environment URLs

Update the environment URLs in the workflow:

```yaml
environment:
  name: development
  url: https://dev.gearment.example.com
```

### Security Scanning

The workflow uses Trivy for vulnerability scanning. You can customize the scan:

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: '${{ env.BACKEND_IMAGE }}:latest'
    format: 'sarif'
    output: 'trivy-results-backend.sarif'
    severity: 'HIGH,CRITICAL'
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure Actions have write permissions
2. **Build Failures**: Check Dockerfile syntax and build context
3. **Deployment Failures**: Verify SSH keys and server access
4. **Security Scan Failures**: Review vulnerability reports

### Debug Information

The workflow includes debug information in the `debug-pipeline` job. Check the logs for:

- Branch and commit information
- Repository details
- Event type

## Migration from GitLab CI

This workflow is designed to be a direct replacement for the GitLab CI pipeline. Key differences:

1. **Registry**: Uses GitHub Container Registry instead of GitLab Registry
2. **Caching**: Uses GitHub Actions cache instead of GitLab cache
3. **Variables**: Uses GitHub context variables instead of GitLab CI variables
4. **Security**: Uses GitHub Security tab for vulnerability reports
5. **Authentication**: Uses default `GITHUB_TOKEN` (classic token) instead of custom tokens

## Important Notes

### Personal Repository Only

This workflow is designed for **personal repositories**. For organization repositories, you'll need to:

1. Use Personal Access Token (PAT) with `write:packages` permission, or
2. Configure organization settings to allow package creation

### First Time Setup

If this is the first time pushing to ghcr.io, you might need to:

1. Create the package manually using PAT once, or
2. Ensure your account has package creation permissions enabled

## Support

For issues or questions about this workflow, please:

1. Check the GitHub Actions documentation
2. Review the workflow logs for error details
3. Verify all required secrets and permissions are configured
4. Ensure you're using a personal repository (not organization)
