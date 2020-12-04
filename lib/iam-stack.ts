import * as iam from '@aws-cdk/aws-iam'
import * as cdk from '@aws-cdk/core'

export interface IamUserStacksProps extends cdk.StackProps {
  userNames: string[],
}

const STRICTED_IPS: string[] = ["0.0.0.0/0"];

export class IamUserStack extends cdk.Stack {

  readonly group: iam.Group = new iam.Group(this, "infra-group", {
    groupName: "infra-groupA",
  });

  readonly readPolicy: iam.ManagedPolicy = new iam.ManagedPolicy(this, "managed-policy", {
    description: "test managed policy",
    managedPolicyName: "ECRReadOnlyPolicy",
    document: iam.PolicyDocument.fromJson(policyDocument),
  })

  constructor(scope: cdk.Construct, id: string, props: IamUserStacksProps) {
    super(scope, id, props);

    this.group.addManagedPolicy(this.readPolicy);

    const users: string[] = props.userNames; 
    users.forEach(u => {
      this.createIamUer(u);
    });
  }

  createIamUer(userName: string): iam.User {
    const user = new iam.User(this, userName, {
      userName: userName,
    });
    user.addToGroup(this.group);
    return user;
  }
}


const policyDocument = {
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "VisualEditor0",
          "Effect": "Allow",
          "Action": [
              "ecr:DescribeImageScanFindings",
              "ecr:GetLifecyclePolicyPreview",
              "ecr:GetDownloadUrlForLayer",
              "ecr:BatchGetImage",
              "ecr:DescribeImages",
              "ecr:GetAuthorizationToken",
              "ecr:DescribeRepositories",
              "ecr:ListTagsForResource",
              "ecr:ListImages",
              "ecr:BatchCheckLayerAvailability",
              "ecr:GetRepositoryPolicy",
              "ecr:GetLifecyclePolicy"
          ],
          "Resource": "*",
          "Condition": {
              "ForAnyValue:IpAddress": {
                  "aws:SourceIp": STRICTED_IPS,
              }
          }
      }
  ]
}