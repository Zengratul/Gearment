# GitHub Actions Troubleshooting Guide

## Common Issues and Solutions

### 1. GitHub Container Registry Permission Issues (Personal Repository)

**Problem**: `denied: installation not allowed to Create organization package`

**Solution**:

- This workflow is designed for **personal repositories** only
- Uses default `GITHUB_TOKEN` (classic token) - no PAT required
- If first time pushing to ghcr.io, you might need to create package manually once
- For organization repositories, use PAT with `write:packages` scope

### 2. Node.js Cache Issues

**Problem**: `Error: Dependencies lock file is not found`

**Solution**:

- Removed `cache: 'npm'` from setup-node action
- Using pnpm-specific caching strategy
- Each job now has its own cache key based on the specific lock file

### 3. Coverage Reports Not Found

**Problem**: Coverage reports are not being generated or uploaded

**Solutions**:

- Added coverage reporters configuration to Jest configs
- Added conditional uploads for coverage reports
- Added debug steps to check coverage files

### 4. pnpm Installation Issues

**Problem**: pnpm not found or installation fails

**Solution**:

- Using `pnpm/action-setup@v2` for proper pnpm installation
- Separate cache keys for backend and frontend
- Using `--frozen-lockfile` for consistent installations

### 5. Authentication Issues with Fine-grained Tokens

**Problem**: Fine-grained tokens don't work for GitHub Container Registry

**Solution**:

- Use classic tokens instead of fine-grained tokens
- Classic tokens have better compatibility with GHCR
- Workflow now uses `GITHUB_TOKEN` (classic token) by default
- For organization repos, use PAT with `write:packages` scope

## Debug Steps

### Check Lock Files

```bash
ls -la backend/pnpm-lock.yaml
ls -la frontend/pnpm-lock.yaml
```

### Check Coverage Files

```bash
ls -la backend/coverage/
ls -la frontend/coverage/
find . -name "*.xml" -o -name "*.json"
```

### Check Node Modules

```bash
ls -la backend/node_modules/
ls -la frontend/node_modules/
```

### Check Repository Type

```bash
# Verify this is a personal repository, not organization
# Check the repository URL: should be github.com/username/repo-name
# NOT github.com/org-name/repo-name
```

### Check Authentication Method

```bash
# Verify workflow uses GITHUB_TOKEN (classic token)
# Check the login step in the workflow logs
```

## Configuration Changes Made

### 1. Jest Configuration Updates

**Backend** (`backend/jest.config.js`):

```javascript
coverageReporters: ['text', 'lcov', 'cobertura'],
```

**Frontend** (`frontend/jest.config.mjs`):

```javascript
coverageDirectory: 'coverage',
coverageReporters: ['text', 'lcov', 'cobertura'],
```

### 2. Workflow Updates

- Removed npm cache from setup-node
- Added separate cache keys for backend and frontend
- Added debug steps for lock files and coverage
- Added conditional coverage uploads
- Uses default `GITHUB_TOKEN` (classic token) for ghcr.io authentication
- Added permissions section for proper token access

### 3. Cache Strategy

**Backend Cache Key**:

```
${{ runner.os }}-pnpm-store-backend-${{ hashFiles('backend/pnpm-lock.yaml') }}
```

**Frontend Cache Key**:

```
${{ runner.os }}-pnpm-store-frontend-${{ hashFiles('frontend/pnpm-lock.yaml') }}
```

### 4. Authentication Strategy

**Classic Token Usage**:

```yaml
permissions:
  contents: read
  packages: write
  id-token: write

- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}  # Classic token
```

## Testing the Workflow

### Manual Trigger

1. Go to Actions tab in GitHub
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Select branch and run

### Check Logs

- Look for "Checking for lock files..." step
- Check "Check coverage files" step output
- Verify cache hits/misses in logs
- Check "Log in to GitHub Container Registry" step
- Verify classic token authentication is working

## Environment Variables

Make sure these are set in your repository:

- `GITHUB_TOKEN` (automatically available - classic token)
- Any deployment secrets if using deployment jobs

## Repository Requirements

### Personal Repository Only

This workflow is designed for **personal repositories**. For organization repositories:

1. Use Personal Access Token (PAT) with `write:packages` scope
2. Or configure organization settings to allow package creation

### First Time Setup

If this is the first time pushing to ghcr.io:

1. You might need to create the package manually using PAT once
2. Or ensure your account has package creation permissions enabled

## Token Comparison

### Classic Token vs Fine-grained Token

| Feature              | Classic Token | Fine-grained Token   |
| -------------------- | ------------- | -------------------- |
| GHCR Compatibility   | ✅ Works well | ❌ Limited support   |
| Setup Complexity     | Simple        | Complex              |
| Permissions          | Scopes-based  | Granular permissions |
| Organization Support | ✅ Good       | ❌ Limited           |
| Default in Workflow  | ✅ Yes        | ❌ No                |

## Next Steps

1. **Test the workflow** with a small change
2. **Monitor the logs** for any errors
3. **Verify coverage reports** are generated
4. **Check Docker builds** complete successfully
5. **Test deployment** if configured
6. **Verify classic token authentication** is working

## Support

If you encounter issues:

1. Check the workflow logs for specific error messages
2. Verify all required files exist in the repository
3. Ensure proper permissions are set for Actions
4. Check that all dependencies are properly configured
5. **Ensure you're using a personal repository (not organization)**
6. **Verify classic token authentication is working**
