import * as ecr from '@aws-cdk/aws-ecr'
import * as cdk from '@aws-cdk/core'

// ecr stack
export interface RepostiroiesStacksProps extends cdk.StackProps {
  repoNames: string[]
}

export class RepositoriesStack extends cdk.Stack {
  public readonly repository: ecr.Repository;
  readonly lifecycleRule: ecr.LifecycleRule = {
    maxImageCount: 10,
    rulePriority: 1,
    tagStatus: ecr.TagStatus.ANY
  }

  constructor(scope: cdk.Construct, id: string, props: RepostiroiesStacksProps) {
    super(scope, id, props);

    const repositories: string[] = props.repoNames; 
    repositories.forEach(repo => {
      this.createRepository(repo, this.lifecycleRule);
    });
  }

  createRepository(repoName: string, lifecycleRule: ecr.LifecycleRule): ecr.Repository {
    const repository = new ecr.Repository(this, repoName, {
      imageScanOnPush: true,
      repositoryName: repoName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      repository.addLifecycleRule(lifecycleRule);
      return repository
  }
}