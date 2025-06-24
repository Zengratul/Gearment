# Setup GHCR_TOKEN for Organization Repository

## Problem

Your repository is an **organization repository**, and the default `GITHUB_TOKEN` doesn't have permission to create packages in organization repositories. You need a Personal Access Token (PAT) with proper permissions.

## Solution: Create Personal Access Token (PAT)

### Step 1: Create Classic Personal Access Token

1. Go to **GitHub.com** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name like **"GitHub Actions Container Registry"**
4. Set expiration (recommend **90 days**)
5. **Select scopes**:
   - ✅ `write:packages` - Upload packages to GitHub Package Registry
   - ✅ `read:packages` - Download packages from GitHub Package Registry
   - ✅ `repo` - Full control of private repositories (if needed)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again)

### Step 2: Add Token to Repository Secrets

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `GHCR_TOKEN`
4. Value: Paste the token you copied
5. Click **"Add secret"**

### Step 3: Verify Setup

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. You should see `GHCR_TOKEN` listed in the secrets
3. The workflow will now use this token for authentication

## Alternative Solutions

### Option A: Use Docker Hub Instead

If you prefer to use Docker Hub instead of GitHub Container Registry:

1. Create a Docker Hub account
2. Create a Docker Hub access token
3. Add these secrets to your repository:

   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token

4. Update the workflow to use Docker Hub:

```yaml
env:
  REGISTRY_URL: docker.io
  REGISTRY_IMAGE: docker.io/yourusername/gearment
  BACKEND_IMAGE: docker.io/yourusername/gearment-backend
  FRONTEND_IMAGE: docker.io/yourusername/gearment-frontend
```

And update the login step:

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

### Option B: Move Repository to Personal Account

If you have admin access to the organization, you can:

1. Transfer the repository to your personal account
2. Use the default `GITHUB_TOKEN` (no PAT needed)

## Testing the Setup

### 1. Manual Test

```bash
# Test login locally (replace with your actual token)
echo "your_ghcr_token_here" | docker login ghcr.io -u your_username --password-stdin
```

### 2. Workflow Test

1. Push a small change to trigger the workflow
2. Check the "Log in to GitHub Container Registry" step
3. Verify no permission errors

### 3. Verify Package Creation

1. Go to your repository → **Packages** tab
2. You should see the created packages
3. Check package visibility settings

## Troubleshooting

### Common Issues

1. **Token Expired**: Create a new PAT and update the secret
2. **Wrong Permissions**: Ensure `write:packages` scope is selected
3. **Repository Access**: Make sure your repository is selected in the token settings
4. **Organization Policy**: Check organization settings for package creation
5. **Repository Visibility**: Ensure repository is public or you have proper access

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
2. **Minimal Permissions**: Only grant necessary scopes (Classic tokens are better for this)
3. **Repository Access**: Limit token access to only the specific repository
4. **Repository Secrets**: Use repository secrets, not environment secrets
5. **Audit Logs**: Monitor package creation in organization audit logs

## Next Steps

1. **Create the PAT** following the steps above
2. **Add the secret** to your repository
3. **Test the workflow** with a small change
4. **Monitor the build** to ensure no permission errors
5. **Verify packages** are created in the Packages tab

## Support

If you encounter issues:

1. Check the workflow logs for specific error messages
2. Verify the PAT has the correct permissions
3. Ensure the secret is properly added to the repository
4. Check organization settings for package creation permissions
