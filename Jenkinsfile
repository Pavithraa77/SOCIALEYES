pipeline {
    agent any

    tools {
        nodejs "NodeJS-18" // Name must match the one set in Global Tool Configuration
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                // Explicitly specify the main branch
                git branch: 'main', url: 'https://github.com/Pavithraa77/SOCIALEYES.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Firebase CLI') {
            steps {
                sh 'npm install -g firebase-tools'
                sh 'firebase --version'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy to Firebase') {
            steps {
                // Ensure FIREBASE_TOKEN is set in Jenkins Environment Variables
                sh 'firebase deploy --token "$FIREBASE_TOKEN"'
            }
        }
    }
}
