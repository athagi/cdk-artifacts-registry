#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { RepositoriesStack } from "../lib/ecr-stack";
import { IamUserStack } from "../lib/iam-stack";
import { Tags } from "@aws-cdk/core";
import * as dotenv from "dotenv";
import * as process from "process";
import * as fs from "fs";
function getProps() {
  dotenv.config();
  if (typeof process.env.OWNER == "undefined") {
    console.error('Error: "OWNER" is not set.');
    console.error("Please consider adding a .env file with OWNER.");
    process.exit(1);
  }
  const owner = process.env.OWNER;
  if (typeof process.env.ENV == "undefined") {
    console.error('Error: "ENV" is not set.');
    console.error("Please consider adding a .env file with ENV.");
    process.exit(1);
  }
  const env = process.env.ENV;
  if (typeof process.env.STACK_NAME_PREFIX == "undefined") {
    console.error('Error: "STACK_NAME_PREFIX" is not set.');
    console.error("Please consider adding a .env file with STACK_NAME_PREFIX.");
    process.exit(1);
  }
  const stackNamePrefix = process.env.STACK_NAME_PREFIX;
  if (typeof process.env.STRICTED_CIDRS == "undefined") {
    console.error('Error: "STRICTED_CIDRS" is not set.');
    console.error("Please consider adding a .env file with STRICTED_CIDRS.");
    process.exit(1);
  }
  const strictedCidrs = process.env.STRICTED_CIDRS?.replace(/\"/g, "").split(
    ","
  );
  if (typeof process.env.DELETION_POLICY == "undefined") {
    console.error('Error: "DELETION_POLICY" is not set.');
    console.error("Please consider adding a .env file with DELETION_POLICY.");
    process.exit(1);
  }
  const deletionPolicyStr = process.env.DELETION_POLICY.toLowerCase();
  let deletionPolicy: cdk.RemovalPolicy;
  switch (deletionPolicyStr) {
    case cdk.CfnDeletionPolicy.RETAIN.toString().toLowerCase():
      deletionPolicy = cdk.RemovalPolicy.RETAIN;
      break;
    case cdk.CfnDeletionPolicy.SNAPSHOT.toString().toLowerCase():
      deletionPolicy = cdk.RemovalPolicy.SNAPSHOT;
      break;
    case cdk.CfnDeletionPolicy.DELETE.toString().toLowerCase():
      deletionPolicy = cdk.RemovalPolicy.DESTROY;
      break;
    default:
      console.error('Error: "DELETION_POLICY" is invalid.');
      console.error(
        "Please set valid value in .env file with DELETION_POLICY."
      );
      process.exit(1);
  }

  if (typeof process.env.STACK_TERMINATION_PROTECTION == "undefined") {
    console.error('Error: "STACK_TERMINATION_PROTECTION" is not set.');
    console.error(
      "Please consider adding a .env file with STACK_TERMINATION_PROTECTION."
    );
    process.exit(1);
  }
  let terminationProtection = false;
  if (process.env.STACK_TERMINATION_PROTECTION.toLowerCase() === "true") {
    terminationProtection = true;
  }
  const groupName: string = owner + "-group";
  const repositories: string[] = readFile("./config/ecr-repositories.txt");
  const iamUsers = readFile("./config/users.txt");
  const iamStackName = stackNamePrefix + "-" + env + "-" + "IAM-Stack";
  const ecrStackName = stackNamePrefix + "-" + env + "-" + "Ecr-Stack";
  return {
    owner: owner,
    env: env,
    stackNamePrefix: stackNamePrefix,
    strictedCidrs: strictedCidrs,
    repositories: repositories,
    groupName: groupName,
    iamUsers: iamUsers,
    iamStackName: iamStackName,
    ecrStackName: ecrStackName,
    deletionPolicy: deletionPolicy,
    terminationProtection: terminationProtection,
  };
}
function readFile(path: string): string[] {
  if (fs.existsSync(path)) {
    const res: string = fs.readFileSync(path, "utf-8");
    return res.split("\n").filter((s) => s);
  } else {
    console.error("File %s is not exist", path);
    return [];
  }
}
function main() {
  let props;
  try {
    props = getProps();
  } catch {
    console.log("read props error");
    process.exit(1);
  }
  let prefix = props.env;
  if (prefix === "master" || prefix === "production") {
    prefix = "";
  }
  const app = new cdk.App();
  const ecrStack = new RepositoriesStack(app, props.ecrStackName, {
    repoNames: props.repositories,
    lifecycleRule: RepositoriesStack.LIFECYCLERULE,
    prefix: prefix,
    removalPolicy: props.deletionPolicy,
    terminationProtection: props.terminationProtection,
  });
  Tags.of(ecrStack).add("Owner", props.owner);
  try {
    const iamStack = new IamUserStack(app, props.iamStackName, {
      userNames: props.iamUsers,
      strictedCidrs: props.strictedCidrs,
      groupName: props.groupName,
      prefix: prefix,
      terminationProtection: props.terminationProtection,
    });
    Tags.of(iamStack).add("Owner", props.owner);
  } catch (e) {
    console.log(e);
  }
  app.synth();
}
main();
