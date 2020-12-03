#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppStack } from '../lib/app-stack';
import { EcrStack } from '../lib/ecr-stack';

const app = new cdk.App();
// new AppStack(app, 'AppStack');


const infra = new AppStack(app, 'CrossStackInfra');

new EcrStack(app, 'Ecr-Stack', {repoName: "fugafuga"});


app.synth()