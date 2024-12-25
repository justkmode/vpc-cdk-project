#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RDSStack } from '../lib/rds-stack';

const app = new cdk.App();

// Create a basic VPC (without a lot of resources for cost minimization)
const vpcStack = new ec2.Vpc(app, 'MyVpc', {
  maxAzs: 1, // Use just one AZ
  natGateways: 0, // No NAT Gateways to save costs
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'PrivateSubnet',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // Keep it private and isolated
    },
  ],
});

// Create the RDS stack and pass the VPC
new RDSStack(app, 'RDSStack', {
  vpc: vpcStack,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
