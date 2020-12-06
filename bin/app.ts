#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RepositoriesStack } from '../lib/ecr-stack';
import { IamUserStack } from '../lib/iam-stack';
import { Tags } from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import * as process from 'process';
import * as fs from 'fs';

function getProps() {
  dotenv.config(); 

  if (typeof process.env.OWNER == 'undefined') {
    console.error('Error: "OWNER" is not set.');
    console.error('Please consider adding a .env file with OWNER.');
    process.exit(1);
  }
  const owner = process.env.OWNER;
  if (typeof process.env.ENV == 'undefined') {
    console.error('Error: "ENV" is not set.');
    console.error('Please consider adding a .env file with ENV.');
    process.exit(1);
  }
  const env = process.env.ENV;
  if (typeof process.env.STACK_NAME_PREFIX == 'undefined') {
    console.error('Error: "STACK_NAME_PREFIX" is not set.');
    console.error('Please consider adding a .env file with STACK_NAME_PREFIX.');
    process.exit(1);
  }
  const stackNamePrefix = process.env.STACK_NAME_PREFIX;
  if (typeof process.env.STRICTED_IPS == 'undefined') {
    console.error('Error: "STRICTED_IPS" is not set.');
    console.error('Please consider adding a .env file with STRICTED_IPS.');
    process.exit(1);
  }
  const strictedIps = process.env.STRICTED_IPS?.replace(/\"/g, '').split(',');
  const groupName: string = owner + "-group"
  const repositories: string[] = readFile('./lib/files/repositories.txt');
  const iamUsers = readFile('./lib/files/users.txt');;
  const iamStackName = stackNamePrefix + "-" + env + "-" + "IAM-Stack";
  const ecrStackName = stackNamePrefix + "-" + env + "-" + "Ecr-Stack";

  return {
    owner: owner,
    env: env,
    stackNamePrefix: stackNamePrefix,
    strictedIps: strictedIps,
    repositories: repositories,
    groupName: groupName,
    iamUsers: iamUsers,
    iamStackName:iamStackName,
    ecrStackName: ecrStackName,
  }
}

function readFile(path: string): string[]{
  if (fs.existsSync(path)) {
    const res: string = fs.readFileSync(path, "utf-8");
    return res.split('\n').filter(s => s);
  }else {
    return []
  }
}

function main() {
  let props;
  try {
    props = getProps();
    console.log(`props: ${props}`);
  } catch {
    console.log("read props error");
    process.exit(1);
  }
  let prefix = props.env;
  if(prefix === "master" || prefix === "production") {
    prefix = "";
  }

  const app = new cdk.App();

  const ecrStack = new RepositoriesStack(app, props.ecrStackName, {
    repoNames: props.repositories,
    lifecycleRule: RepositoriesStack.LIFECYCLERULE,
    prefix: prefix});  
  Tags.of(ecrStack).add("Owner", props.owner);
  
  try {
    const iamStack = new IamUserStack(app, props.iamStackName, {
      userNames: props.iamUsers,
      strictedIps: props.strictedIps,
      groupName: props.groupName,
      prefix: prefix,
    });
    Tags.of(iamStack).add("Owner", props.owner);
  } catch(e) {
    console.log(e)
  }
  
  app.synth()
}

main();
