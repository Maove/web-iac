pipeline {
  agent any

  environment {
    TF_DIR = 'terraform'
    APP_DIR = 'app'
    INSTANCE_IP = ''
  }

  stages {
    stage('Checkout') {
      steps {
          withCredentials([gitUsernamePassword(credentialsId: 'my-credentials-id', gitToolName: 'git-tool')]) {
              git 'https://github.com/Maove/web-iac.git#main'
          }
      }
    }

    stage('Terraform Init & Apply') {
      steps {
        dir("${TF_DIR}") {
          sh 'terraform init'
          sh 'terraform apply -auto-approve'
        }
      }
    }

    stage('Get Instance IP') {
      steps {
        script {
          def output = sh(script: "cd ${TF_DIR} && terraform output -raw instance_ip", returnStdout: true).trim()
          env.INSTANCE_IP = output
          echo "Instance IP: ${env.INSTANCE_IP}"
        }
      }
    }

    stage('Deploy App') {
      steps {
        sh """
        ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa ec2-user@${env.INSTANCE_IP} '
        cd web-app-iac/app &&
        git pull &&
        npm install &&
        pm2 restart index.js || pm2 start index.js
        '
        """
      }
    }
  }
}
