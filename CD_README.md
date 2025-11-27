CI/CD Integration (Jenkins + Ansible Tower)
========================================

This document explains how to connect this repository to a Jenkins multibranch pipeline and deploy artifacts with Ansible (CLI or Tower/AWX).

1) Jenkins Setup (high level)
--------------------------------
- Install Jenkins and required plugins:
  - Git, GitHub Branch Source, Pipeline, Credentials, Docker Pipeline (if using docker on agent), Ansible, SSH Credentials
- Create credentials in Jenkins:
  - Docker registry credentials (username/password) — credential id used in `Jenkinsfile` as `docker-hub-credentials`.
  - SSH key credential for deployment host (credential id used in `Jenkinsfile` as `ansible-ssh-creds`).
  - A `DOCKER_REGISTRY` secret (either as text or use proper credentials and reference them in the pipeline).
- Create a Multibranch Pipeline job in Jenkins pointing to this Git repository; Jenkins will scan the branches and run the `Jenkinsfile` per-branch.

2) GitFlow strategy
--------------------
- Branches:
  - `main` (production)
  - `develop` (integration/staging)
  - `feature/*` (developer work)
  - `release/*` (release candidates)

- Recommended flow:
  - Developers create `feature/*` branches and open PRs to `develop`.
  - When `develop` is stable, create a `release/*` branch; QA runs tests.
  - Merge `release/*` to `main` after final validation. Jenkins will deploy on `release/*` and `main` (per the `Jenkinsfile`).

3) Registry & Credentials
--------------------------
- Use a Docker registry (Docker Hub, ECR, GCR, etc.). Configure Jenkins credentials and reference them in the pipeline.

4) Ansible Tower / AWX
------------------------
- Option A (CLI-driven): Jenkins runs `ansible-playbook` against inventory. Jenkins agent needs Ansible installed.
- Option B (Tower-driven): Create a Job Template in Ansible Tower pointing to this repo playbook and inventory and trigger it from Jenkins via Tower API or `awx` CLI. Provide a Job Template that accepts `image_backend` and `image_frontend` as extra vars.

5) Secure secrets
------------------
- Never store production credentials in the repo. Use Jenkins Credentials, Ansible Vault, or Tower secrets.

6) Useful commands for debugging
--------------------------------
- Run playbook locally against `hosts.ini`:
  ```bash
  ansible-playbook -i infra/ansible/inventory/hosts.ini infra/ansible/playbooks/deploy_app.yml --extra-vars "image_backend=REPO/backend:tag image_frontend=REPO/frontend:tag"
  ```

7) Next steps I can implement for you
-------------------------------------
- Add Dockerfiles (done) and validate builds locally.
- Add a `docker-compose` for single-host testing.
- Add AWX templates / example `curl` to trigger Tower from Jenkins.
