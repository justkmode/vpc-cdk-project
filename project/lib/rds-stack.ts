// Add Imports
// In rds-stack.ts, add the necessary imports at the top of the file:

import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

// Define the Stack Props Interface
// Create an interface to accept the VPC from the ProjectStack:

interface RDSStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
  }
  
// Create the RDS Stack Class
// Define the RDSStack class and pass the VPC from the ProjectStack:

export class RDSStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: RDSStackProps) {
      super(scope, id, props);
  
      const dbInstance = new rds.DatabaseInstance(this, 'RDSInstance', {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_8_0,
        }),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
        vpc: props.vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        allocatedStorage: 20,
        maxAllocatedStorage: 30,
        deletionProtection: false,
        storageType: rds.StorageType.GP2,
        multiAz: false,
        publiclyAccessible: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
  
      new cdk.CfnOutput(this, 'DBEndpoint', {
        value: dbInstance.dbInstanceEndpointAddress,
        description: 'The endpoint of the RDS instance',
      });
    }
  }

// Update the bin/project.ts File
// Update the bin/project.ts file to include the RDSStack and pass the VPC from ProjectStack: