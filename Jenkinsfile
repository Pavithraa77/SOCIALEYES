pipeline {
    agent any

    tools {
        nodejs "NodeJS-18" // Name must match the one you set in Global Tool Configuration
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
                // Use sh for macOS/Linux
                sh 'npm install'
            }
        }

        stage('Install Firebase CLI') {
            steps {
                sh 'npm install -g firebase-tools'
                sh 'firebase --version'
            }
        }

        stage('Deploy to Firebase') {
            steps {
                sh 'firebase deploy --token "your_token_here"'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build React App') {
            steps {
                // Assuming 'npm run dev' is what you want; adjust if needed
                sh 'npm run build'
            }
        }
        stage('Deploy to Firebase') {
            steps {
                // Deploy to Firebase using the environment variable FIREBASE_TOKEN
                sh 'firebase deploy --token "$FIREBASE_TOKEN"'
            }
        }
    }
}
