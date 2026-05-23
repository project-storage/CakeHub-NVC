pipeline {
    agent any

    environment {
        DISCORD_WEBHOOK = credentials('DISCORD_WEBHOOK_URL')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('nest-backend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend-next') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            sh """
            curl -X POST -H "Content-Type: application/json" \
            -d '{"content": "✅ Build and Deployment Successful! Project: ${env.JOB_NAME} Build: #${env.BUILD_NUMBER}"}' \
            ${DISCORD_WEBHOOK}
            """
        }
        failure {
            sh """
            curl -X POST -H "Content-Type: application/json" \
            -d '{"content": "❌ Build or Deployment Failed! Project: ${env.JOB_NAME} Build: #${env.BUILD_NUMBER}"}' \
            ${DISCORD_WEBHOOK}
            """
        }
    }
}
