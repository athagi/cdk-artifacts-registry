import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
export interface IamUserStacksProps extends cdk.StackProps {
  userNames: string[];
  strictedCidrs: string[];
  groupName: string;
  prefix?: string;
}
interface policyDocumentType {
  Version: string;
  Statement: policyDocumentStateType[];
}
interface policyDocumentStateType {
  Sid: string;
  Effect: string;
  Action: string[];
  Resource: string;
  Condition: ipAddressType;
}
interface ipAddressType {
  IpAddress: sourceIpType;
}
interface sourceIpType {
  "aws:SourceIp": string[];
}
export class IamUserStack extends cdk.Stack {
  private CIDR_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(3[0-2]|[12]?[0-9])$/;
  constructor(scope: cdk.Construct, id: string, props: IamUserStacksProps) {
    super(scope, id, props);
    props.strictedCidrs.forEach((ip) => {
      if (!this.CIDR_REGEX.test(ip)) {
        throw new Error("invalid ips");
      }
    });
    let prefix = "";
    if (
      props.prefix &&
      props.prefix.length > 0 &&
      !props.prefix.match(/(master|prod|production|main)/)
    ) {
      prefix = `${props.prefix}-`;
    }
    const group: iam.Group = new iam.Group(
      this,
      `${prefix}${props.groupName}`,
      {
        groupName: `${prefix}${props.groupName}`,
      }
    );
    const baseGroupInlinePolicy: iam.Policy = new iam.Policy(
      this,
      group + "InlinePolicy",
      {
        document: iam.PolicyDocument.fromJson(
          this.generateDefaultPolicyJson(props.strictedCidrs)
        ),
      }
    );
    group.attachInlinePolicy(baseGroupInlinePolicy);
    const users = props.userNames;
    users.forEach((u) => {
      const userName = `${prefix}${u}`;
      const user: iam.User = this.createIamUser(userName, group);
      const inlinePolicy: iam.Policy = new iam.Policy(
        this,
        userName + "-policy",
        {
          document: iam.PolicyDocument.fromJson(
            this.generateInlinePolicyJson(props.strictedCidrs, userName)
          ),
        }
      );
      user.attachInlinePolicy(inlinePolicy);
    });
  }
  createIamUser(userName: string, group: iam.Group): iam.User {
    const user: iam.User = new iam.User(this, userName, {
      userName: userName,
    });
    user.addToGroup(group);
    return user;
  }
  generateInlinePolicyJson(
    ips: string[],
    username: string
  ): policyDocumentType {
    const userPolicyDocument = {
      Version: "2008-10-17",
      Statement: [
        {
          Sid: "AllowPush",
          Effect: "Allow",
          Action: [
            "ecr:CompleteLayerUpload",
            "ecr:InitiateLayerUpload",
            "ecr:PutImage",
            "ecr:UploadLayerPart",
            "ecr-public:CompleteLayerUpload",
            "ecr-public:InitiateLayerUpload",
            "ecr-public:PutImage",
            "ecr-public:UploadLayerPart",
          ],
          Resource: `arn:aws:ecr:*:*:repository/${username}/*`,
          Condition: {
            IpAddress: {
              "aws:SourceIp": ips,
            },
          },
        },
      ],
    };
    return userPolicyDocument;
  }
  generateDefaultPolicyJson(ips: string[]): policyDocumentType {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "VisualEditor0",
          Effect: "Allow",
          Action: [
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
            "ecr-public:GetRegistryCatalogData",
          ],
          Resource: "*",
          Condition: {
            IpAddress: {
              "aws:SourceIp": ips,
            },
          },
        },
      ],
    };
    return policyDocument;
  }
}
