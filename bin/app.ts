#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppStack } from '../lib/app-stack';
import { RepositoriesStack } from '../lib/ecr-stack';
import { Tags } from '@aws-cdk/core';

const app = new cdk.App();
// new AppStack(app, 'AppStack');

const OWNER = "hogehoge";

const infra = new AppStack(app, 'CrossStackInfra');

const repositories: string[] = ["hoge/aaaa", "hoge/bbbb", "fuga/aaa", "foo"];

const ecrStack = new RepositoriesStack(app, 'Ecr-Stack', {repoNames: repositories, lifecycleRule: RepositoriesStack.LIFECYCLERULE});  
Tags.of(ecrStack).add("Owner", OWNER);



app.synth()