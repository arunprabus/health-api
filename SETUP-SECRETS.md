# Required GitHub Secrets for Health API

## Repository: health-api

Add these secrets in **Settings** → **Secrets and variables** → **Actions**:

### Container Registry
```
DOCKERHUB_USERNAME: arunprabusiva
DOCKERHUB_TOKEN: <your-dockerhub-token>
```

### Infrastructure Repository Access
```
INFRA_REPO_TOKEN: <github-personal-access-token>
```
- Create at: https://github.com/settings/tokens
- Scopes: `repo`, `workflow`
- Used to trigger deployments in dev2prod-healthapp

## Branch → Environment Mapping

| Branch | Environment | Infrastructure Network | Namespace |
|--------|-------------|----------------------|-----------|
| `main` | prod | higher | health-app-prod |
| `staging` | test | lower | health-app-test |
| `develop` | dev | lower | health-app-dev |

## Deployment Flow

1. **Push to branch** → Triggers health-api workflow
2. **Build container** → Push to Docker Hub
3. **Trigger webhook** → Calls dev2prod-healthapp repository
4. **Deploy to K8s** → Uses appropriate kubeconfig secret
5. **Update namespace** → Deploys to correct environment

## Testing Deployment

```bash
# Test dev deployment
git push origin develop

# Test staging deployment  
git push origin staging

# Test production deployment
git push origin main
```