import { expect as expectCDK, haveResource, SynthUtils } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Iam from "../lib/iam-stack";

describe("snapshot test", () => {
  it("iam is created", () => {
    const app = new cdk.App();
    const userNames = ["user1", "user2"];
    const groupName = "test-group";
    const prefix = "test";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
      prefix: prefix,
    });
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});

describe("fine grained tests", () => {
  it("User Created and assigned to created group", () => {
    const app = new cdk.App();
    const userNames = ["user1", "user2"];
    const groupName = "test-group";
    const prefix = "test";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
      prefix: prefix,
    });

    userNames.forEach((user) => {
      expectCDK(stack).to(
        haveResource("AWS::IAM::User", {
          UserName: `${prefix}-${user}`,
          Groups: [
            {
              Ref: "testtestgroup35B39A5B",
            },
          ],
        })
      );
    });
  });

  it("Policy Created with multiple stricted ips", () => {
    const app = new cdk.App();
    const userNames = ["user1", "user2"];
    const groupName = "test-group";
    const prefix = "test";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0", "192.168.0.0/16"],
      groupName: groupName,
      prefix: prefix,
    });

    expectCDK(stack).to(
      haveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: [
            {
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
              Condition: {
                IpAddress: {
                  "aws:SourceIp": ["0.0.0.0/0", "192.168.0.0/16"],
                },
              },
              Effect: "Allow",
              Resource: "arn:aws:ecr:*:*:repository/test-user1/*",
              Sid: "AllowPush",
            },
          ],
          Version: "2012-10-17",
        },
      })
    );
  });

  it("User Created with empty string", () => {
    const app = new cdk.App();
    const userNames = ["user1", "user2"];
    const groupName = "test-group";
    const prefix = "";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
      prefix: prefix,
    });

    userNames.forEach((user) => {
      expectCDK(stack).to(
        haveResource("AWS::IAM::User", {
          UserName: user,
          Groups: [
            {
              Ref: "testgroupF19E2EE8",
            },
          ],
        })
      );
    });
  });

  it("User Created with master", () => {
    const app = new cdk.App();
    const userNames = ["user1", "user2"];
    const groupName = "test-group";
    const prefix = "master";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
      prefix: prefix,
    });

    userNames.forEach((user) => {
      expectCDK(stack).to(
        haveResource("AWS::IAM::User", {
          UserName: user,
          Groups: [
            {
              Ref: "testgroupF19E2EE8",
            },
          ],
        })
      );
    });
  });

  it("User Created without prefix", () => {
    const app = new cdk.App();
    const userNames = ["user1", "user2"];
    const groupName = "test-group";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
    });

    userNames.forEach((user) => {
      expectCDK(stack).to(
        haveResource("AWS::IAM::User", {
          UserName: user,
          Groups: [
            {
              Ref: "testgroupF19E2EE8",
            },
          ],
        })
      );
    });
  });

  it("Group Created", () => {
    const app = new cdk.App();
    const userNames = ["user1"];
    const prefix = "test";
    const groupName = "test-group";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
      prefix: prefix,
    });
    expectCDK(stack).to(
      haveResource("AWS::IAM::Group", {
        GroupName: `${prefix}-${groupName}`,
      })
    );
  });

  it("Group Created without prefix", () => {
    const app = new cdk.App();
    const userNames = ["user1"];
    const prefix = "";
    const groupName = "test-group";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
      prefix: prefix,
    });
    expectCDK(stack).to(
      haveResource("AWS::IAM::Group", {
        GroupName: groupName,
      })
    );
  });
});

describe("validation tests", () => {
  it("pass valid ip", () => {
    const app = new cdk.App();
    const userNames = ["user1", "user2"];
    const groupName = "test-group";
    const prefix = "test";
    const stack = new Iam.IamUserStack(app, "MyTestStack", {
      userNames: userNames,
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,
      prefix: prefix,
    });

    userNames.forEach((user) => {
      expectCDK(stack).to(
        haveResource("AWS::IAM::User", {
          UserName: `${prefix}-${user}`,
        })
      );
    });
  });

  it("pass invalid ip", () => {
    const app = new cdk.App();
    const userNames = ["user1"];
    const groupName = "test-group";
    try {
      new Iam.IamUserStack(app, "MyTestStack", {
        userNames: userNames,
        strictedIps: ["0.0.0.256/0"],
        groupName: groupName,
      });
      throw new Error("failed");
    } catch (e) {
      // test pass
    }
  });
});
