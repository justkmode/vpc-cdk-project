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
  
      // Ensure VPC is defined
      if (!props.vpc) {
        throw new Error("VPC is undefined. Ensure you pass a valid VPC.");
      }
  
      // Create a subnet group for the RDS instance
      const subnetGroup = new rds.SubnetGroup(this, "RdsSubnetGroup", {
        vpc: props.vpc,
        description: "Subnet group for RDS instance",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
  
      // Create the RDS instance
      new rds.DatabaseInstance(this, "MyRDSInstance", {
        engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
        vpc: props.vpc,
        vpcSubnets: props.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }),
        multiAz: false,
        allocatedStorage: 20,
        maxAllocatedStorage: 100,
        storageType: rds.StorageType.GP2,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        deletionProtection: false,
        publiclyAccessible: false,
        subnetGroup: subnetGroup,
      });
    }
  }

// Update the bin/project.ts File
// Update the bin/project.ts file to include the RDSStack and pass the VPC from ProjectStack: