import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
// import * as ecr from '@aws-cdk/aws-ecr';

// class AppStack extends cdk.Stack {
export class AppStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
  }
}
