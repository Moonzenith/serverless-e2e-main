import {
    Stack, StackProps,
    aws_dynamodb as Dynamo,
    aws_dax as Dax,
    aws_ec2 as EC2,
    aws_s3 as S3,
    aws_iam as IAM,
    Fn,
    aws_lambda as Lambda,
    aws_lambda_event_sources as LambdaEventSources,
    CfnOutput,
    RemovalPolicy,
} from 'aws-cdk-lib'

import { Construct } from 'constructs'

export interface S3AITagStackProps extends StackProps {
    // table: Dynamo.Table
    // daxCache: Dax.CfnCluster
    // webapp?: string
}


export class S3AITagStack extends Stack {

    constructor(scope: Construct, id: string, props: S3AITagStackProps) {
        super(scope, id, props)
    
        // [x] create s3 folder
        const bucket = new S3.Bucket(this, 'src-bucket', {
            accessControl: S3.BucketAccessControl.PRIVATE,
            removalPolicy: RemovalPolicy.RETAIN,
        })

        // [x] create lambda handler
        const taggerHandler = new Lambda.Function(this, 's3-handler', {
            runtime: Lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Lambda.Code.fromAsset('./lib/s3-ai-tag/functions/s3-handler')
        })

        taggerHandler.addToRolePolicy(new IAM.PolicyStatement({
            actions: ['rekognition:DetectLabels', 'rekognition:DetectModerationLabels'],
            resources: ['*'],
            effect: IAM.Effect.ALLOW,
        }))
        
        taggerHandler.addToRolePolicy(new IAM.PolicyStatement({
            actions: ['s3:*'],
            resources: ['*'],
            // resources: [bucket.bucketArn],
            effect: IAM.Effect.ALLOW,
        }))

        // [ ] assign s3 as source for lambda  
        taggerHandler.addEventSource(new LambdaEventSources.S3EventSource(bucket, {
            events: [S3.EventType.OBJECT_CREATED],
        }))

    }

}