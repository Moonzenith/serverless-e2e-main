import {
    Stack,
    StackProps,
    aws_dynamodb as DynamoDB,
    aws_lambda as Lambda,
    aws_lambda_event_sources as LambdaEventSources,
    aws_iam as IAM,
    aws_timestream as TimeStream,
    aws_sqs as SQS,
    aws_sns as SNS,
    aws_quicksight as Quicksight,
    CfnOutput,
    Duration,
    RemovalPolicy,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class BackendStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const timeToLiveAttribute = '_expireOn'

        // [ ] 3.1.1: create DynamoDB orders table [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-dynamodb-readme.html)
        const ordersTable = new DynamoDB.Table(this, 'orders', {
            partitionKey: { name: 'customer', type: DynamoDB.AttributeType.STRING },
            sortKey: { name: 'id', type: DynamoDB.AttributeType.STRING },
            billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
            stream: DynamoDB.StreamViewType.NEW_AND_OLD_IMAGES,
            timeToLiveAttribute,
            removalPolicy: RemovalPolicy.DESTROY,
        })

        // [ ] 3.1.2: connect api to dynamodb
        new CfnOutput(this, 'ordersTableName', {
            value: ordersTable.tableName,
            exportName: 'ordersTableName'
        })
        new CfnOutput(this, 'ordersTableArn', {
            value: ordersTable.tableArn,
            exportName: 'ordersTableArn'
        })


        // [ ] 4.1.1: create processing orders queue
        const ordersQueue = new SQS.Queue(this, 'ordersQueue', {
            visibilityTimeout: Duration.seconds(60)
        })

        // [ ] 4.1.2: create user notification topic (sns) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-sns.Topic.html)
        const userNotificationTopic = new SNS.Topic(this, 'userNotification')

        // [ ] 4.2.1: create a lambda to handle dynamodb stream
        const dynamoLambda = new Lambda.Function(this, 'dynamoHandler', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            code: Lambda.Code.fromAsset('../functions/dynamo-handler'),
            handler: 'index.handler',
            environment: {
                QUEUE: ordersQueue.queueUrl,
                TS_DB: '',
                TS_TABLE: '',
            },
        })
        new CfnOutput(this, 'dynamoLambda', {
            value: dynamoLambda.functionName,
        })

        // [ ] 4.2.2: create a lambda to handle sqs messages
        const sqsLambda = new Lambda.Function(this, 'sqsHandler', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            code: Lambda.Code.fromAsset('../functions/sqs-handler'),
            handler: 'index.handler',
            environment: { QUEUE: ordersQueue.queueUrl },
        })
        new CfnOutput(this, 'sqsLambda', {
            value: sqsLambda.functionName,
        })



        // [ ] 4.3.1: set lambda 4.2.1 as handler for dynamodb table updates
        ordersTable.grantStreamRead(dynamoLambda)
        dynamoLambda.addEventSource(new LambdaEventSources.DynamoEventSource(ordersTable, {
            startingPosition: Lambda.StartingPosition.TRIM_HORIZON,
            batchSize: 10,
            
        }))

        // [ ] 4.3.2: set lambda 4.2.2 as handler for sqs queue messages
        ordersQueue.grantSendMessages(sqsLambda)
        sqsLambda.addEventSource(new LambdaEventSources.SqsEventSource(ordersQueue, {
            batchSize: 2,
        }))



        /////////////////


        const TimeStreamDBName = 'serverless-e2e-db'
        const usersLogsTableName = 'ordersts'


        const TimestreamDB = new TimeStream.CfnDatabase(this, 'serverless-e2e-db', {
            databaseName: TimeStreamDBName,
        })

        const ordersTSTable = new TimeStream.CfnTable(this, 'ordersts', {
            tableName: usersLogsTableName,
            databaseName: TimestreamDB.databaseName || '',

            retentionProperties: {
                MemoryStoreRetentionPeriodInHours: '36',
                MagneticStoreRetentionPeriodInDays: `${100 * 364}`
            },
            tags: [{ key: 'project', value: 'hackaton-score-app' }],
        })

        dynamoLambda.addEnvironment('TS_DB', TimeStreamDBName)
        dynamoLambda.addEnvironment('TS_TABLE', usersLogsTableName)

        new CfnOutput(this, 'timestreamDB', {
            value: TimestreamDB.databaseName?.toString() || '',
        })

        new CfnOutput(this, 'timestreamTable', {
            value: ordersTSTable.tableName?.toString() || '',
        })


        ordersTSTable.addDependsOn(TimestreamDB)




        const timeStreamPolicyStatement = new IAM.PolicyStatement({
            actions: [
                // "timestream:DescribeEndpoints",
                // "timestream:UpdateTable",
                "timestream:DescribeDatabase",
                "timestream:DescribeTable",
                "timestream:ListMeasures",
                "timestream:Select",
                "timestream:WriteRecords",
            ],
            resources: [TimestreamDB.attrArn.toString(), ordersTSTable.attrArn.toString()],
        })
        const timeStreamEndpointsPolicyStatement = new IAM.PolicyStatement({
            actions: [
                "timestream:DescribeEndpoints",
            ],
            resources: ["*"],
            // resources: ["arn:aws:timestream:*"],
            // resources: [TimestreamDB.attrArn.toString(), ordersTSTable.attrArn.toString()],
        })

        dynamoLambda.role?.attachInlinePolicy(
            new IAM.Policy(this, 'use-timestream-policy', {
                statements: [
                    timeStreamPolicyStatement,
                    timeStreamEndpointsPolicyStatement,
                ],
            })
        )

    }
}
