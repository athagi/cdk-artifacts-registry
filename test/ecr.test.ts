import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Ecr from '../lib/ecr-stack';

test('ECR projects Created', () => {
  const app = new cdk.App();
  // WHEN
  const repoNames = ["testrepo1", "testrepo2", "testrepo3", "testrepo4"]
  const stack = new Ecr.RepositoriesStack(app, 'MyTestStack', {repoNames: repoNames});
  // THEN
  repoNames.forEach(repo => {
    expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
      RepositoryName: repo
    }));
    
  });
});


test('ECR repository count', () => {
  const app = new cdk.App();
  // WHEN
  const repoNames = ["testrepo1", "testrepo2", "testrepo3", "testrepo4"]
  const stack = new Ecr.RepositoriesStack(app, 'MyTestStack', {repoNames: repoNames});
  // THEN
  expectCDK(stack).to(countResources("AWS::ECR::Repository", repoNames.length))
});


