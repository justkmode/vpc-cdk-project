// Import necessary CDK modules
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

// Define interface to accept VPC from the VPC stack
interface RDSStackProps extends cdk.StackProps {
  vpc: ec2.Vpc; // The VPC in which the RDS instance will be created
}

// Define the RDSStack class
export class RDSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RDSStackProps) {
    super(scope, id, props);

    // Create the RDS instance
    const dbInstance = new rds.DatabaseInstance(this, 'MyRDSInstance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0, // Use MySQL 8.0 as the database engine
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3, // Use T3 instance type
        ec2.InstanceSize.MICRO // Use t3.micro for cost efficiency
      ),
      vpc: props.vpc, // Place the RDS instance in the provided VPC
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // Use private isolated subnets
      },
      allocatedStorage: 20, // Initial storage size in GB
      maxAllocatedStorage: 30, // Maximum storage size in GB for scaling
      deletionProtection: false, // Disable deletion protection for the exercise
      publiclyAccessible: false, // Ensure the instance is not publicly accessible
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Allow the RDS instance to be deleted
      storageEncrypted: true, // Enable encryption for storage
      credentials: rds.Credentials.fromGeneratedSecret('admin'), // Auto-generate admin credentials
      multiAz: true, // Enable high availability by deploying across multiple AZs
      autoMinorVersionUpgrade: true, // Enable automatic minor version upgrades
    });

    // Add tags for easy identification
    cdk.Tags.of(dbInstance).add('Environment', 'Development');
    cdk.Tags.of(dbInstance).add('Project', 'MyRDSProject');

    // Output the database endpoint
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: dbInstance.instanceEndpoint.hostname,
      description: 'The endpoint of the RDS instance',
    });
  }
}
