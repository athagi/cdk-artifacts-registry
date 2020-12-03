import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Ecr from '../lib/ecr-stack';

test('ECR project Created', () => {
  const app = new cdk.App();
  // WHEN
  const repoName = "testrepo"
  const stack = new Ecr.EcrStack(app, 'MyTestStack', {repoName: repoName});
  // THEN
  expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
    
    RepositoryName: repoName,
    ImageScanningConfiguration: {
      scanOnPush: true
    },
  }));
});


test('ECR repository count', () => {
  const app = new cdk.App();
  // WHEN
  const repoName = "testrepo"
  const stack = new Ecr.EcrStack(app, 'MyTestStack', {repoName: repoName});
  // THEN
  expectCDK(stack).to(countResources("AWS::ECR::Repository", 1))
   
});
