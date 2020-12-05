import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Iam from '../lib/iam-stack';

describe('snapshot test', () => {
  it("iam is created", () => {
    const app = new cdk.App();
    // WHEN
    const userNames = ["user1", "user2"]
    const stack = new Iam.IamUserStack(app, 'MyTestStack', {userNames: userNames, stricted_ips: ["0.0.0.0/0"]});
    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  })
})

describe('fine grained tests', () => {
  it('ECR projects Created', () => {
    const app = new cdk.App();
    // WHEN
    const userNames = ["user1", "user2"]
    const stack = new Iam.IamUserStack(app, 'MyTestStack', {userNames: userNames, stricted_ips: ["0.0.0.0/0"]});
    // THEN
    userNames.forEach(user => {
      expectCDK(stack).to(haveResource("AWS::IAM::User", {
        UserName: user
      }));
    });
  });


})

