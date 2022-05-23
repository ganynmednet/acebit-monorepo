# AWS CLI

https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html
https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-amazon-elastic-container-service
EC2 launch



aws ecr get-login --region eu-west-2 - USE BELOW WITH PASSWORD

aws ecr list-images --repository-name validator
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 079980807395.dkr.ecr.eu-west-2.amazonaws.com/validator

docker tag validator:latest 079980807395.dkr.ecr.eu-west-2.amazonaws.com/validator:v1
docker push 079980807395.dkr.ecr.eu-west-2.amazonaws.com/validator:v1
