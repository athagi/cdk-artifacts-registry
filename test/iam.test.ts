import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Iam from '../lib/iam-stack';

describe('snapshot test', () => {
  it("iam is created", () => {
    const app = new cdk.App();
    // WHEN
    const userNames = ["user1", "user2"]
    const groupName = "test-group";
    const stack = new Iam.IamUserStack(app, 'MyTestStack',  {
      userNames: userNames, 
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,});
    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  })
})

describe('fine grained tests', () => {
  it('User Created', () => {
    const app = new cdk.App();
    // WHEN
    const userNames = ["user1", "user2"]
    const groupName = "test-group";
    const stack = new Iam.IamUserStack(app, 'MyTestStack',  {
      userNames: userNames, 
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,});
    // THEN
    userNames.forEach(user => {
      expectCDK(stack).to(haveResource("AWS::IAM::User", {
        UserName: user,
      }));
    });
  });

  it('Group Created', () => {
    const app = new cdk.App();
    const userNames = ["user1"];
    const groupName = "test-group";
    const stack = new Iam.IamUserStack(app, 'MyTestStack',  {
      userNames: userNames, 
      strictedIps: ["0.0.0.0/0"],
      groupName: groupName,});
    expectCDK(stack).to(haveResource("AWS::IAM::Group", {
      "GroupName": groupName,
    }));
  });



})

