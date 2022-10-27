import * as cdk from 'aws-cdk-lib'
import { Capture, Match, Template } from 'aws-cdk-lib/assertions'
import { BackendStack } from '../lib/backend-stack'


function getTemplate() {
    const app = new cdk.App()
    const backendStack = new BackendStack(app, 'MyTestStack')
    return Template.fromStack(backendStack)
}

describe("backend stack", () => {


    test('all required resources are present', () => {
        const template = getTemplate()

        template.resourceCountIs('AWS::DynamoDB::Table', 1)
        template.resourceCountIs('AWS::SQS::Queue', 1)
        template.resourceCountIs('AWS::SNS::Topic', 1)
        template.resourceCountIs('AWS::Lambda::Function', 2)
        template.resourceCountIs('AWS::Lambda::EventSourceMapping', 2)
        template.resourceCountIs('AWS::IAM::Role', 2)
        template.resourceCountIs('AWS::IAM::Policy', 3)
        template.resourceCountIs('AWS::Timestream::Database', 1)
        template.resourceCountIs('AWS::Timestream::Table', 1)
        template.resourceCountIs('AWS::IAM::Role', 2)

    })

    test('dynamo table key', () => { })

    test('dynamo table config', () => { })

    test('dynamo table as source of lambda', () => {
        const template = getTemplate()

        const functionNameCapture = new Capture()
        const batchSizeCapture = new Capture()

        template.hasResourceProperties('AWS::Lambda::EventSourceMapping',
            Match.objectLike({
                FunctionName: {
                    Ref: functionNameCapture,
                },
                BatchSize: batchSizeCapture,
            }))

        expect(functionNameCapture.asString()).not.toBeNull()
        expect(batchSizeCapture.asNumber()).toBeGreaterThanOrEqual(2)
    })

    test('dynamo table key', () => { })



})