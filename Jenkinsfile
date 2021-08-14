pipeline {
    agent any

    stages {
        stage("clone application") {
            steps {
                echo 'cloning the application...'
            }
        }
        stage("build") {
            steps {
                echo 'building the application...'
            }
        }

        stage("code-style-check") {
            steps {
                echo 'checking code style...'
            }
        }
    }
}