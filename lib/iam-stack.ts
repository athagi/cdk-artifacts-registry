import * as iam from '@aws-cdk/aws-iam'
import * as cdk from '@aws-cdk/core'

export interface IamUserStacksProps extends cdk.StackProps {
  userNames: string[],
  strictedIps: string[],
  groupName: string,
}

export class IamUserStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: IamUserStacksProps) {
    super(scope, id, props);

    const group: iam.Group = new iam.Group(this, props.groupName, {
      groupName: props.groupName,
    });
    const baseGroupInlinePolicy: iam.Policy = new iam.Policy(this, group + "InlinePolicy", {
      document: iam.PolicyDocument.fromJson(this.generateDefaultPolicyJson(props.strictedIps))
    });
    group.attachInlinePolicy(baseGroupInlinePolicy);

    const users = props.userNames; 
    const document = iam.PolicyDocument.fromJson(this.generateInlinePolicyJson("policyDocument"));
    users.forEach(u => {
      const user: iam.User = this.createIamUser(u, group);
      const inlinePolicy: iam.Policy = new iam.Policy(this, u + "-policy", {
        document: document
      });
      user.attachInlinePolicy(inlinePolicy);
    });
  }

  createIamUser(userName: string, group: iam.Group): iam.User {
    const user = new iam.User(this, userName, {
      userName: userName,
    });
    user.addToGroup(group);
    return user;
  }

  generateInlinePolicyJson(username: string) {
    const userPolicyDocument = {
      "Version": "2008-10-17",
      "Statement": [
        {
          "Sid": "AllowPush",
          "Effect": "Allow",
          "Action": [
            "ecr:CompleteLayerUpload",
            "ecr:InitiateLayerUpload",
            "ecr:PutImage",
            "ecr:UploadLayerPart",
            "ecr-public:CompleteLayerUpload",
            "ecr-public:InitiateLayerUpload",
            "ecr-public:PutImage",
            "ecr-public:UploadLayerPart",
          ],
          "Resource": `arn:aws:ecr:*:*:repository/${username}/*`
        }
      ]
    };
    return userPolicyDocument;
  }

  generateDefaultPolicyJson(ips: string[]) {
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
              "ecr:GetLifecyclePolicy",
              "ecr-public:GetAuthorizationToken",
              "sts:GetServiceBearerToken",
              "ecr-public:BatchCheckLayerAvailability",
              "ecr-public:GetRepositoryPolicy",
              "ecr-public:DescribeRepositories",
              "ecr-public:DescribeRegistries",
              "ecr-public:DescribeImages",
              "ecr-public:DescribeImageTags",
              "ecr-public:GetRepositoryCatalogData",
              "ecr-public:GetRegistryCatalogData"
          ],
          "Resource": "*",
          "Condition" : {
            "ForAnyValue:IpAddress": {
                "aws:SourceIp": ips,
            },
          },
        }
      ]
    }
    return policyDocument
  } 
}
