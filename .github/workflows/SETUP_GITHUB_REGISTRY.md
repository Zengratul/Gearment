# GitHub Container Registry Setup Guide

## For Personal Repositories

This workflow is designed for **personal repositories** and uses the default `GITHUB_TOKEN` to push Docker images to GitHub Container Registry (ghcr.io).

### ✅ No Setup Required for Personal Repositories

If your repository is a **personal repository** (not organization):

- ✅ **No Personal Access Token (PAT) needed**
- ✅ **No additional secrets required**
- ✅ **Uses default `GITHUB_TOKEN`**
- ✅ **Works out of the box**

### Repository Check

Verify your repository is personal:

- URL should be: `github.com/your-username/repo-name`
- NOT: `github.com/org-name/repo-name`

## For Organization Repositories

If you're using an **organization repository**, you'll need a Personal Access Token (PAT).

### Problem

```
ERROR: failed to push ghcr.io/org-name/repo-name/backend:master: denied: installation not allowed to Create organization package
```

This error occurs because the default `GITHUB_TOKEN` doesn't have permission to create packages in organization repositories.

### Solution: Use Personal Access Token (PAT)

#### Step 1: Create Personal Access Token

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "GitHub Actions Container Registry"
4. Set expiration (recommend 90 days)
5. Select these scopes:
   - ✅ `write:packages` - Upload packages to GitHub Package Registry
   - ✅ `read:packages` - Download packages from GitHub Package Registry
   - ✅ `repo` - Full control of private repositories
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again)

#### Step 2: Add Token to Repository Secrets

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GHCR_TOKEN`
4. Value: Paste the token you copied
5. Click "Add secret"

#### Step 3: Update Workflow

For organization repositories, update the workflow to use PAT:

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GHCR_TOKEN }} # Use PAT instead of GITHUB_TOKEN
```

## Alternative Solutions

### Option A: Use User Repository Instead of Organization

If you're using an organization repository, consider:

- Moving the repository to your personal account, or
- Using a different container registry (Docker Hub, etc.)

### Option B: Configure Organization Settings

Organization admins can:

1. Go to Organization → Settings → Actions → General
2. Enable "Allow GitHub Actions to create and approve pull requests"
3. Enable "Read and write permissions" for Actions

### Option C: Use Different Registry

Update the workflow to use Docker Hub or another registry:

```yaml
env:
  REGISTRY_URL: docker.io
  REGISTRY_IMAGE: docker.io/yourusername/gearment
  BACKEND_IMAGE: docker.io/yourusername/gearment-backend
  FRONTEND_IMAGE: docker.io/yourusername/gearment-frontend
```

And update login:

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

## Testing the Setup

### 1. Manual Test

```bash
# Test login locally
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
```

### 2. Workflow Test

1. Push a small change to trigger the workflow
2. Check the "Log in to GitHub Container Registry" step
3. Verify no permission errors

### 3. Verify Package Creation

1. Go to your repository → Packages tab
2. You should see the created packages
3. Check package visibility settings

## Troubleshooting

### Common Issues

1. **Token Expired**: Create a new PAT and update the secret
2. **Wrong Permissions**: Ensure `write:packages` scope is selected
3. **Organization Policy**: Check organization settings for package creation
4. **Repository Visibility**: Ensure repository is public or you have proper access

### Debug Steps

1. **Check Token Permissions**:

   ```bash
   curl -H "Authorization: token $GHCR_TOKEN" https://api.github.com/user
   ```

2. **Test Package Creation**:

   ```bash
   curl -H "Authorization: token $GHCR_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/user/packages
   ```

3. **Check Organization Settings**:
   - Go to Organization → Settings → Packages
   - Ensure package creation is enabled

## Security Best Practices

1. **Token Rotation**: Rotate PAT every 90 days
2. **Minimal Permissions**: Only grant necessary scopes
3. **Repository Secrets**: Use repository secrets, not environment secrets
4. **Audit Logs**: Monitor package creation in organization audit logs

## Alternative Registries

If GitHub Container Registry continues to have issues:

### Docker Hub

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

### AWS ECR

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Log in to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v1
```

## Next Steps

### For Personal Repositories

1. **No setup required** - workflow works out of the box
2. **Test the workflow** with a small change
3. **Monitor the build** to ensure no permission errors
4. **Verify packages** are created in the Packages tab

### For Organization Repositories

1. **Create the PAT** following the steps above
2. **Add the secret** to your repository
3. **Update the workflow** to use PAT
4. **Test the workflow** with a small change
5. **Monitor the build** to ensure no permission errors
6. **Verify packages** are created in the Packages tab
