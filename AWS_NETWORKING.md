
# VALIDATOR CONFIGURATION
- https://medium.com/boltops/gentle-introduction-to-how-aws-ecs-works-with-example-tutorial-cea3d27ce63d

**TASK**
- https://eu-west-2.console.aws.amazon.com/ecs/home?region=eu-west-2#/clusters/validatorCluster/tasks/7c3d5c84dafd4d85b1694f43e4bfde0c/details

**Service**
- https://eu-west-2.console.aws.amazon.com/ecs/home?region=eu-west-2#/clusters/validatorCluster/services/validatorService/details
- when crete service, subnet is chosen

**Target group**
- https://eu-west-2.console.aws.amazon.com/ec2/v2/home?region=eu-west-2#TargetGroups:search=arn:aws:elasticloadbalancing:eu-west-2:079980807395:targetgroup/ecs-valida-validatorService/0b83d601a5d2cc00

**Aplication Load Balancer**
- https://eu-west-2.console.aws.amazon.com/ec2/v2/home?region=eu-west-2#LoadBalancers:sort=loadBalancerName
- ALB listener must be configured to the Target group, can't be done without Default SSL/TLS certificate (ACM below)

**ACM**
- https://eu-west-2.console.aws.amazon.com/acm/home?region=eu-west-2#/certificates/list

**ROUTE 53**
- https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones#ListRecordSets/Z04232941NZS0M9CG0VVK
- domain neoworldgame.xyz
- Route 53 domain A record must be created and routed to ALB