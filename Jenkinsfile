pipeline {
    agent none

    environment {
        DOCKERHUB_USER = 'saeed126'
        IMAGE_NAME = 'flaskapp'
        DOCKERHUB_PASS = credentials('Dockerhub-cred')
    }

    stages {

        stage('Checkout Code') {
            agent { label 'built-in' }
            steps {
                git branch: 'master',
                    url: 'https://github.com/saeedtamboli01/flaskapp-project.git'
                
                stash name: 'source_code', includes: '**'
            }
        }

        stage('Build Docker Image') {
            agent { label 'build-node' }
            steps {
                unstash 'source_code'
                sh '''
                docker login -u $DOCKERHUB_USER -p $DOCKERHUB_PASS
                docker build -t $DOCKERHUB_USER/$IMAGE_NAME:latest .
                docker push $DOCKERHUB_USER/$IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy') {
            agent { label 'deploy-node' }
            steps {
                sh '''
                docker login -u $DOCKERHUB_USER -p $DOCKERHUB_PASS

                docker pull $DOCKERHUB_USER/$IMAGE_NAME:latest

                docker stop flask-app || true
                docker rm flask-app || true

                docker run -d \
                    --name flask-app \
                    -p 5000:5000 \
                    $DOCKERHUB_USER/$IMAGE_NAME:latest
                '''
            }
        }
    }
}