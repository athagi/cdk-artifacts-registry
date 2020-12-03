import * as ecr from '@aws-cdk/aws-ecr'
import * as cdk from '@aws-cdk/core'

// ecr stack
export interface EcrStackProps extends cdk.StackProps {
  repoName: string
}

export class EcrStack extends cdk.Stack {
  public readonly repository: ecr.Repository;
  readonly lifecycleRule: ecr.LifecycleRule = {
      description: "this is test",
      maxImageCount: 10,
      rulePriority: 1,
      tagStatus: ecr.TagStatus.ANY
    }

  constructor(scope: cdk.Construct, id: string, props: EcrStackProps) {
    super(scope, id, props);

    this.repository = new ecr.Repository(this, 'ecr-repository', {
    imageScanOnPush: true,
    repositoryName: props?.repoName,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.repository.addLifecycleRule(this.lifecycleRule);


  //   new cdk.CfnOutput(this, 'ecr-repository', { value: this.repository.repositoryName });
  }
}
  
