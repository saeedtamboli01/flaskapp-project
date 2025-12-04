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
            1. CHECKOUT SOURCE CODE (MASTER NODE)
        ----------------------------------------------------------*/
        stage('Checkout Code') {
            agent { label 'built-in' }
            steps {
                echo "Pulling code from GitHub..."
                git branch: 'master',
                    url: 'https://github.com/saeedtamboli01/flaskapp-project.git'

                stash name: 'source_code', includes: '**'
                echo "Source code stashed successfully."
            }
        }


        /* ---------------------------------------------------------
            2. RUN PYTESTS (BUILD-NODE)
        ----------------------------------------------------------*/
        stage('Run Unit Tests') {
            agent { label 'build-node' }
            steps {
                unstash 'source_code'

                sh '''
                    echo "Creating virtual environment..."
                    python3 -m venv venv

                    echo "Activating virtual environment..."
                    . venv/bin/activate

                    echo "Installing Python dependencies..."
                    pip install --upgrade pip
                    pip install -r requirements.txt
                    pip install pytest pytest-cov

                    echo "Running tests..."
                    pytest -v --junitxml=test-results.xml
                '''
            }
            post {
                always {
                    junit 'test-results.xml'
                }
            }
        }


        /* ---------------------------------------------------------
            3. BUILD & PUSH DOCKER IMAGE (BUILD-NODE)
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

                    echo "Building Docker image..."
                    docker build -t $DOCKERHUB_USER/$IMAGE_NAME:$BUILD_VERSION .

                    echo "Pushing versioned image..."
                    docker push $DOCKERHUB_USER/$IMAGE_NAME:$BUILD_VERSION

                    echo "Tagging latest..."
                    docker tag $DOCKERHUB_USER/$IMAGE_NAME:$BUILD_VERSION \
                               $DOCKERHUB_USER/$IMAGE_NAME:latest

                    echo "Pushing latest tag..."
                    docker push $DOCKERHUB_USER/$IMAGE_NAME:latest

                    echo "Cleaning Docker build cache..."
                    docker system prune -af || true
                '''

                echo "Docker Image pushed successfully."
            }
        }


        /* ---------------------------------------------------------
            4. DEPLOY TO SERVER (DEPLOY-NODE)
        ----------------------------------------------------------*/
        stage('Deploy to Server') {
            agent { label 'deploy-node' }
            steps {
                sh '''
                    echo "Logging into DockerHub..."
                    echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin

                    echo "Pulling latest image..."
                    docker pull $DOCKERHUB_USER/$IMAGE_NAME:latest

                    echo "Stopping old container..."
                    docker stop flask-app || true
                    docker rm flask-app || true

                    echo "Starting new container..."
                    docker run -d \
                        --name flask-app \
                        -p 5000:5000 \
                        $DOCKERHUB_USER/$IMAGE_NAME:latest

                    echo "Deployment successful!"
                '''
            }
        }
    }

    post {
        success {
            echo "PIPELINE SUCCESS ✔️"
        }
        failure {
            echo "PIPELINE FAILED ❌ Fix your code or config."
        }
    }
}
