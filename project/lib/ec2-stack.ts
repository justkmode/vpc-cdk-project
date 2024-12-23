import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

// Props

interface EC2StackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
}