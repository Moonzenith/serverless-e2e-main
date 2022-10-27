import {
    Stack,
    StackProps,
    aws_cognito as Cognito,
    aws_lambda as Lambda,
    CfnOutput,
    Fn,
    Duration,
    RemovalPolicy,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'



export class AuthStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const authenticateLambda = new Lambda.Function(this, 'authentication', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: Lambda.Code.fromAsset('../functions/authenticate'),
        })


        const authorizerLambda = new Lambda.Function(this, 'authorization', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: Lambda.Code.fromAsset('../function/authorize'),
        })
        

    }
}