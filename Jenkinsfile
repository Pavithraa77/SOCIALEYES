pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Pavithraa77/SOCIALEYES.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test -- --coverage'
            }
        }
    }

    post {
        always {
            // Ensure this step runs within a node block
            node {
                junit '**/jest-results.xml'
            }
        }
    }
}
