pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Pavithraa77/SOCIALEYES.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }
        stage('Build React App') {
            steps {
                bat 'npm run dev'
            }
        }
        stage('Deploy to Firebase') {
            steps {
                bat 'firebase deploy --token "$FIREBASE_TOKEN"'
            }
        }
    }
}
