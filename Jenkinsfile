// Declarative multibranch Jenkinsfile configured to follow GitFlow
// - feature/*: builds + reports only
// - develop: builds, tests, pushes images to registry (staging)
// - release/* and main: build, push, deploy (production)

pipeline {
  agent any

  environment {
    REGISTRY = credentials('DOCKER_REGISTRY') // set in Jenkins as secret text or use DOCKER_HOST
    REGISTRY_CRED = 'docker-hub-credentials' // Jenkins credential id (username/password)
    DOCKER_IMAGE_BACKEND = "${env.REGISTRY}/ai_project_backend"
    DOCKER_IMAGE_FRONTEND = "${env.REGISTRY}/ai_project_frontend"
    ANSIBLE_CREDENTIALS = 'ansible-ssh-creds' // id of SSH key credential to reach target host
    ANSIBLE_INVENTORY = 'infra/ansible/inventory/hosts.ini'
    BUILD_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '30'))
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script { echo "Branch: ${env.BRANCH_NAME}" }
      }
    }

    stage('Install & Test (Backend)') {
      when { expression { return env.BRANCH_NAME != null } }
      steps {
        dir('backend') {
          sh 'python -m venv .venv || true'
          sh '. .venv/bin/activate && pip install -r requirements.txt'
          // place for backend tests if any
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          sh "docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG} ./backend"
          sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG} ./frontend"
        }
      }
    }

    stage('Push Docker Images') {
      when {
        anyOf {
          branch 'develop'
          branch 'release/*'
          branch 'main'
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: REGISTRY_CRED, passwordVariable: 'REG_PWD', usernameVariable: 'REG_USER')]) {
          sh 'echo $REG_PWD | docker login ${REGISTRY} -u $REG_USER --password-stdin'
          sh "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG}"
          sh "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}"
        }
      }
    }

    stage('Deploy (Ansible)') {
      when {
        anyOf {
          branch 'release/*'
          branch 'main'
        }
      }
      steps {
        script {
          // Option A: use local Ansible CLI on Jenkins agent (ensure ansible and community.docker are installed)
          sh "ansible-playbook -i ${ANSIBLE_INVENTORY} infra/ansible/playbooks/deploy_app.yml --extra-vars \"image_backend=${DOCKER_IMAGE_BACKEND}:${BUILD_TAG} image_frontend=${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}\""

          // Option B: trigger Ansible Tower / AWX Job Template via tower-cli or curl to AWX API (not implemented here)
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline succeeded.'
    }
    failure {
      echo 'Pipeline failed.'
    }
    cleanup {
      sh 'docker image prune -f || true'
    }
  }
}
