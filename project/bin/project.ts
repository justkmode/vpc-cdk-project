#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProjectStack } from '../lib/project-stack';
import { RDSStack } from '../lib/rds-stack';
import { EC2Stack } from '../lib/ec2-stack';

const app = new cdk.App();

// 👇 Define the environment (pulled from your AWS CLI config)
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || '637423194321',
  region: process.env.CDK_DEFAULT_REGION || 'eu-north-1',
};


// ✅ Instantiate the VPC stack with the env
const projectStack = new ProjectStack(app, 'ProjectStack', { env });

// ✅ Pass VPC and env to RDS
new RDSStack(app, 'RDSStack', {
  vpc: projectStack.vpc,
  env,
});

// ✅ Pass VPC and env to EC2
new EC2Stack(app, 'MyEC2Stack', {
  vpc: projectStack.vpc,
  env,
});
