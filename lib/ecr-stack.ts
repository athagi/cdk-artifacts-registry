import * as ecr from "@aws-cdk/aws-ecr";
import * as cdk from "@aws-cdk/core";
// ecr stack
export interface RepostiroiesStacksProps extends cdk.StackProps {
  repoNames: string[];
  lifecycleRule: ecr.LifecycleRule;
  prefix?: string;
  removalPolicy?: cdk.RemovalPolicy;
}
export class RepositoriesStack extends cdk.Stack {
  public readonly repository: ecr.Repository;
  static LIFECYCLERULE: ecr.LifecycleRule = {
    maxImageCount: 10,
    rulePriority: 1,
    tagStatus: ecr.TagStatus.ANY,
  };
  constructor(
    scope: cdk.Construct,
    id: string,
    props: RepostiroiesStacksProps
  ) {
    super(scope, id, props);
    const repositories: string[] = props.repoNames;
    let prefix = "";
    if (
      props.prefix &&
      props.prefix.length > 0 &&
      !props.prefix.match(/(master|prod|production|main)/)
    ) {
      prefix = `${props.prefix}-`;
    }
    if (!props.removalPolicy) {
      props.removalPolicy = cdk.RemovalPolicy.DESTROY;
    }
    repositories.forEach((repo) => {
      this.createRepository(`${prefix}${repo}`, props);
    });
  }
  createRepository(
    repoName: string,
    props: RepostiroiesStacksProps
  ): ecr.Repository {
    const lifecycleRule: ecr.LifecycleRule = props.lifecycleRule;
    const repository = new ecr.Repository(this, repoName, {
      imageScanOnPush: true,
      repositoryName: repoName,
      removalPolicy: props.removalPolicy,
    });
    repository.addLifecycleRule(lifecycleRule);
    return repository;
  }
}
