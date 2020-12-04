import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Iam from '../lib/iam-stack';

describe('snapshot test', () => {
  it("iam is created", () => {
    const app = new cdk.App();
    // WHEN
    const userNames = ["user1", "user2"]
    const stack = new Iam.IamUserStack(app, 'MyTestStack', {userNames: userNames});
    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  })
})

