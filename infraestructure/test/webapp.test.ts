import * as cdk from 'aws-cdk-lib'
import { Capture, Match, Template } from 'aws-cdk-lib/assertions'
import { WebAppStack } from '../lib/webapp-stack'


function getTemplate() {
    const app = new cdk.App()
    const webappStack = new WebAppStack(app, 'MyTestStack')
    return Template.fromStack(webappStack)
}

describe('1.1.1: create S3 Bucket as web hosting to store webapp', () => {

    test('webapp bucket is private', () => {
        const template = getTemplate()

        template.hasResourceProperties('AWS::S3::Bucket', {
            AccessControl: 'Private',
        })
    })

    test('all required resources are present', () => {
        // const template = getTemplate()
        const app = new cdk.App()
        const webappStack = new WebAppStack(app, 'MyTestStack')
        const template = Template.fromStack(webappStack)
        
        template.resourceCountIs('AWS::S3::Bucket', 1)
        template.resourceCountIs('AWS::S3::BucketPolicy', 1)

    })
})
// describe('1.1.2: add command to update web assets in S3', () => {})
describe('1.2.1: create CloudFront distribution', () => {

    test('all required resources are present', () => {
        // const template = getTemplate()
        const app = new cdk.App()
        const webappStack = new WebAppStack(app, 'MyTestStack')
        const template = Template.fromStack(webappStack)
        
        template.resourceCountIs('AWS::CloudFront::Distribution', 1)
        template.resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1)

    })
    
})
// describe('1.2.2: add command to invalidate cloudfront distribution', () => {})

describe("webapp stack", () => {

    test('all required resources are present', () => {
        // const template = getTemplate()
        const app = new cdk.App()
        const webappStack = new WebAppStack(app, 'MyTestStack')
        const template = Template.fromStack(webappStack)
        
        template.resourceCountIs('AWS::CloudFront::Distribution', 1)
        template.resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1)

    })





    
    test('webapp bucket has cors configured', () => {
        const template = getTemplate()

        template.hasResourceProperties('AWS::S3::Bucket', {
            CorsConfiguration: {
                CorsRules: [{
                    AllowedHeaders: ["Authorization"],
                    AllowedMethods: ["GET"],
                    AllowedOrigins: ["*"],
                    ExposedHeaders: []
                }]
            }
        })
    })

})