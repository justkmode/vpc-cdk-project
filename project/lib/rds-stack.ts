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

    // Define a parameter group for PostgreSQL
    const parameterGroup = new rds.ParameterGroup(this, 'PostgreSQLParameterGroup', {
        engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_11,
        }),
        parameters: {
          log_min_duration_statement: '1000', // Example: Log queries taking longer than 1 second
          max_connections: '100', // Example: Custom max connections
        },
      });
  

    // Create the RDS instance with PostgreSQL
    const rdsInstance = new rds.DatabaseInstance(this, 'PostgreSQLInstance', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_11, // Use PostgreSQL version 13.7
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
      backupRetention: cdk.Duration.days(7), // Retain backups for 7 days
      parameterGroup, // Use the custom parameter group
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Allow the RDS instance to be deleted
      storageEncrypted: true, // Enable encryption for storage
      credentials: rds.Credentials.fromGeneratedSecret('postgres_user'), // Auto-generate admin credentials
      multiAz: true, // Enable high availability by deploying across multiple AZs
      autoMinorVersionUpgrade: true, // Enable automatic minor version upgrades
    });

    // Add tags for easy identification
    cdk.Tags.of(rdsInstance).add('Environment', 'Development');
    cdk.Tags.of(rdsInstance).add('Project', 'MyPostgreSQLProject');

    // Output the database endpoint
    new cdk.CfnOutput(this, 'PostgreSQLEndpoint', {
      value: rdsInstance.dbInstanceEndpointAddress,
      description: 'PostgreSQL Database Endpoint',
    });
  }
}
