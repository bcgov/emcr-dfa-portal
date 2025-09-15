# cd-public-portal-ui.yaml
- name: Checkout ArgoCD Repo
  id: gitops
  uses: actions/checkout@v4
  with:
    repository: bcgov-c/tenant-gitops-c2ee1a
    ref: develop
    token: ${{ secrets.GITOPS_KEY }} # `GH_PAT` is a secret that contains your PAT
    path: gitops

- name: Update Helm values in gitops
  id: helm
  if: steps.gitops.outcome == 'success' # Only run if the previous step (publish) was successful
  run: |
    # Clone the GitOps deployment configuration repository
    # Navigate to the directory containing your Helm values file for the environment develop -> DEV, test -> test and 
    cd gitops/charts

    # Update the Helm values file with the new image tag and version
    DATETIME=$(date +'%Y-%m-%d %H:%M:%S')  # Get current date and time

    sed -i  "s/uipubtag: .*/uipubtag: dev # Image Updated on $DATETIME/" ../deploy/dev_public_values.yaml
    sed -i  "s/uipubversion: .*/uipubversion: v-${{ steps.short_sha.outputs.SHORT_SHA }} # Version Updated on $DATETIME/" ../deploy/dev_public_values.yaml

    sed -i  "s/uipubtag: .*/uipubtag: dev # Image Updated on $DATETIME/"  dfa-portal-ui-public/values.yaml
    sed -i  "s/uipubversion: .*/uipubversion: v-${{ steps.short_sha.outputs.SHORT_SHA }} # Version Updated on $DATETIME/"  dfa-portal-ui-public/values.yaml

    # Commit and push the changes
    git config --global user.email "actions@github.com"
    git config --global user.name "GitHub Actions"

    git add .

    git add ../deploy/dev_public_values.yaml

    # Repackage Helm Chart

    cd dfa-gitops-public

    helm dependency build

    cd charts

    git add .

    git commit -m "Update Dev UI image tag"
    git push origin develop  # Update the branch name as needed
