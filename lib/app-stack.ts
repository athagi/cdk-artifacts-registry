import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    const ecrLifecycleRule: ecr.LifecycleRule = {
      description: "this is test",
      maxImageCount: 10,
      rulePriority: 1,
      tagStatus: ecr.TagStatus.ANY
    }

    const ecrRepository = new ecr.Repository(this, 'Repo', {
      imageScanOnPush: true,
      repositoryName: "hogehoge",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    ecrRepository.addLifecycleRule(ecrLifecycleRule);
  }
}
