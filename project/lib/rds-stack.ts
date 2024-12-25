import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Tags } from 'aws-cdk-lib'; // For tagging support

interface RDSStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class RDSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RDSStackProps) {
    super(scope, id, props);

    const rdsInstance = new rds.DatabaseInstance(this, 'MyRDSInstance', {
      instanceIdentifier: 'my-rds-instance',
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_23, // MySQL 8.0
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO), // t3.micro or smaller instance
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      multiAz: false, // Use a single AZ for cost savings
      allocatedStorage: 20, // 20GB initial storage
      maxAllocatedStorage: 30, // Max storage 30GB
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Clean up when the stack is deleted
      deletionProtection: false, // Disable deletion protection for this practice
      backupRetention: cdk.Duration.days(1), // Retain backups for 1 day
      publiclyAccessible: false, // Do not expose publicly
    });

    // Add a tag to the RDS instance
    Tags.of(rdsInstance).add('Name', 'MyRDSInstance');

    // Output the RDS instance endpoint
    new cdk.CfnOutput(this, 'RDSInstanceEndpoint', {
      value: rdsInstance.dbInstanceEndpointAddress,
    });
  }
}
