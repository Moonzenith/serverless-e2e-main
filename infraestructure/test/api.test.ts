import * as cdk from 'aws-cdk-lib'
import { Capture, Match, Template } from 'aws-cdk-lib/assertions'
import { RestApiStack } from '../lib/api-stack'


function getTemplate() {
    const app = new cdk.App()
    const apiStack = new RestApiStack(app, 'MyTestStack')
    return Template.fromStack(apiStack)
}

describe("api stack", () => {

    test('all required resources are present', () => {
        const template = getTemplate()
        
        template.resourceCountIs('AWS::Lambda::Function', 5)
        template.resourceCountIs('AWS::ApiGateway::RestApi', 1)
        template.resourceCountIs('AWS::ApiGateway::Resource', 4)
        template.resourceCountIs('AWS::ApiGateway::Method', 9)
        

    })



    test('api must have nodejs lambdas', () => {
        const template = getTemplate()

        template.hasResourceProperties('AWS::Lambda::Function', {
            Runtime: 'nodejs14.x',
            Handler: 'index.handler',
        })

    })



    // test('api gateway is set with 2 resources', () => {
        // const template = getTemplate()

    //     template.hasResourceProperties('AWS::ApiGateway::RestApi', 
    //         Match.objectEquals({

    //         })
    //     )


    // })

})