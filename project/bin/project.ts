#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProjectStack } from '../lib/project-stack';
import { RDSStack } from '../lib/rds-stack';

const app = new cdk.App();

// Instantiate the ProjectStack
const projectStack = new ProjectStack(app, 'ProjectStack');

// Instantiate the RDSStack and pass the VPC from ProjectStack
new RDSStack(app, 'RDSStack', {
  vpc: projectStack.vpc,
});

// Export the VPC from project-stack.ts
// Update your ProjectStack to export the VPC so it can be used in RDSStack: