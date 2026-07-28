pipeline {
    agent any

    tools {
        nodejs 'node-22'
    }

    environment {
        APP_NAME   = 'partner-admin-panel'
        DEPLOY_DIR = "/var/www/${APP_NAME}"
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'yarn install --frozen-lockfile'
            }
        }

        stage('Lint & Typecheck') {
            parallel {
                stage('Lint') {
                    steps { sh 'yarn lint' }
                }
                stage('Typecheck') {
                    steps { sh 'npx tsc --noEmit' }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    def envFile = env.BRANCH_NAME == 'main' ? '.env.production' : '.env.development'
                    sh "cp ${envFile} .env"
                }
                sh 'yarn build'
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh """
                    mkdir -p ${DEPLOY_DIR}
                    rsync -az --delete .next public package.json ${DEPLOY_DIR}/
                    cd ${DEPLOY_DIR} && yarn install --production --frozen-lockfile
                    pm2 reload ${APP_NAME} || pm2 start yarn --name ${APP_NAME} -- start
                """
            }
        }
    }

    post {
        success { echo "✅ ${APP_NAME} build #${env.BUILD_NUMBER} succeeded" }
        failure { echo "❌ ${APP_NAME} build #${env.BUILD_NUMBER} failed" }
        always  { cleanWs(deleteDirs: true, notFailBuild: true) }
    }
}
