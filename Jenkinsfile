pipeline {
    agent none

    environment {
        DOCKERHUB_USER = 'saeed126'
        IMAGE_NAME     = 'flaskapp'
        DOCKERHUB_PASS = credentials('Dockerhub-cred')
    }

    options {
        timestamps()
    }

    stages {

        /* ---------------------------------------------------------
            CHECKOUT – ALWAYS ON JENKINS MASTER
        ----------------------------------------------------------*/
        stage('Checkout Code') {
            agent { label 'built-in' }
            steps {
                echo 'Checking out source code...'

                git branch: 'master',
                    url: 'https://github.com/saeedtamboli01/flaskapp-project.git'

                stash name: 'source_code', includes: '**'
                echo 'Source code stashed.'
            }
        }

        /* ---------------------------------------------------------
            RUN PYTESTS – ALWAYS ON BUILD AGENT
        ----------------------------------------------------------*/
        stage('Run PyTests') {
            agent { label 'build-node' }
            steps {
                unstash 'source_code'

                sh '''
                    echo "Checking Python..."
                    python3 --version

                    echo "Creating virtual environment..."
                    python3 -m venv venv
                    . venv/bin/activate

                    pip install --upgrade pip
                    pip install -r requirements.txt

                    echo "Running tests..."
                    pytest -v --junitxml=test-results.xml
                '''

                junit 'test-results.xml'
            }
        }

        /* ---------------------------------------------------------
            BUILD & PUSH DOCKER IMAGE
        ----------------------------------------------------------*/
        stage('Build & Push Docker Image') {
            agent { label 'build-node' }
            environment {
                BUILD_VERSION = "${env.BUILD_NUMBER}"
            }
            steps {
                unstash 'source_code'

                sh '''
                    echo "Logging into DockerHub..."
                    echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin

                    echo "Building image..."
                    docker build -t $DOCKERHUB_USER/$IMAGE_NAME:$BUILD_VERSION .

                    echo "Pushing versioned tag..."
                    docker push $DOCKERHUB_USER/$IMAGE_NAME:$BUILD_VERSION

                    echo "Tagging as latest..."
                    docker tag $DOCKERHUB_USER/$IMAGE_NAME:$BUILD_VERSION $DOCKERHUB_USER/$IMAGE_NAME:latest

                    echo "Pushing latest..."
                    docker push $DOCKERHUB_USER/$IMAGE_NAME:latest

                    docker system prune -af
                '''

                echo 'Docker image build & push complete.'
            }
        }

        /* -----------------------------------------------------------
            DEPLOY – ALWAYS ON DEPLOYMENT AGENT
        -----------------------------------------------------------*/
        stage('Deploy to Server') {
            agent { label 'deploy-node' }
            steps {
                sh '''
                    echo "Logging into DockerHub..."
                    echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin

                    echo "Pulling latest image..."
                    docker pull $DOCKERHUB_USER/$IMAGE_NAME:latest

                    echo "Stopping existing container..."
                    docker stop flask-app || true
                    docker rm flask-app || true

                    echo "Starting new container..."
                    docker run -d \
                        --name flask-app \
                        -p 5000:5000 \
                        $DOCKERHUB_USER/$IMAGE_NAME:latest

                    echo "Deployment completed."
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'PIPELINE SUCCESS ✅'
        }
        failure {
            echo 'PIPELINE FAILED ❌'
        }
    }
}
