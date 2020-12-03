import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Ecr from '../lib/ecr-stack';


describe('fine grained tests', () => {
  it('ECR projects Created', () => {
    const app = new cdk.App();
    // WHEN
    const repoNames = ["testrepo1", "testrepo2", "testrepo3", "testrepo4"]
    const stack = new Ecr.RepositoriesStack(app, 'MyTestStack', {repoNames: repoNames, lifecycleRule: Ecr.RepositoriesStack.LIFECYCLERULE});
    // THEN
    repoNames.forEach(repo => {
      expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
        RepositoryName: repo
      }));
    });
  });
  
  
  it('ECR repository count', () => {
    const app = new cdk.App();
    // WHEN
    const repoNames = ["testrepo1", "testrepo2", "testrepo3", "testrepo4"]
    const stack = new Ecr.RepositoriesStack(app, 'MyTestStack', {repoNames: repoNames, lifecycleRule: Ecr.RepositoriesStack.LIFECYCLERULE});
    // THEN
    expectCDK(stack).to(countResources("AWS::ECR::Repository", repoNames.length))
  });

})


describe('snapshot test', () => {
  it("repository is created", () => {
    const app = new cdk.App();
    // WHEN
    const repoNames = ["testrepo1", "testrepo2", "testrepo3", "testrepo4"]
    const stack = new Ecr.RepositoriesStack(app, 'MyTestStack', {repoNames: repoNames, lifecycleRule: Ecr.RepositoriesStack.LIFECYCLERULE});
    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  })
})

describe('Validation tests', () => {
  // todo うまい書き方がわからない
  it('Validate ecr lifecycle rule', () => {
    const app = new cdk.App();
    // WHEN
    const repoNames = ["testrepo1", "testrepo2", "testrepo3", "testrepo4"]
    const lifecyclePolicyText = JSON.stringify({
      "rules":[{
        "rulePriority":1,
        "selection": {
          "tagStatus":"any",
          "countType":"imageCountMoreThan",
          "countNumber":10,
        },
        "action": {
          "type":"expire"
        },
      }]
    });

    const stack = new Ecr.RepositoriesStack(app, 'MyTestStack', {repoNames: repoNames, lifecycleRule: Ecr.RepositoriesStack.LIFECYCLERULE});
    // THEN
    repoNames.forEach(repo => {
      expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
        RepositoryName: repo,
        ImageScanningConfiguration: {
          scanOnPush: true
        },
        LifecyclePolicy: {
          LifecyclePolicyText: lifecyclePolicyText
        }
      }));
    });
  });
})