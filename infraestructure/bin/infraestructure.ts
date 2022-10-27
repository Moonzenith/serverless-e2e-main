#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { WebAppStack } from '../lib/webapp-stack'
import { RestApiStack } from '../lib/api-stack'
import { BackendStack } from '../lib/backend-stack'
import { IConstruct } from 'constructs'
const app = new cdk.App()


// creating WebAppStack
// const testWebapp = new WebAppStack(app, 'testWebapp', {
//   env: { region: process.env.AWS_REGION },
//   assetsPath: '../test-webapp'
// })

// creating WebAppStack
const certificate = new WebAppStack(app, 'certificate', {
  env: { region: process.env.AWS_REGION },
  assetsPath: '../certificate-of-completion',
  // domainName: 'certificate.diegotrs.com'
})


// creating WebAppStack
const apidoc = new WebAppStack(app, 'apidoc', {
  env: { region: process.env.AWS_REGION },
  assetsPath: '../apidoc'
})

// creating WebAppStack
const webapp = new WebAppStack(app, 'webapp', {
  env: { region: process.env.AWS_REGION },
  assetsPath: '../webapp'
})

// creating RestApiStack
const api = new RestApiStack(app, 'api', {
  env: {
    region: process.env.AWS_REGION,
  }
})

api.get('/users', function(event, context) {
  //asdasdasda
  // get fron dynamo
  return {
    users: []
  }
})

api.post('/users', function() {
  // create user on ddbb
})


// creating BackendStack
const backend = new BackendStack(app, 'backend', {
  env: {
    region: process.env.AWS_REGION,
  }
})

// {
//   "Version": "2012-10-17",
//   "Statement": [
//       {
//           "Effect": "Allow",
//           "Action": [
//               "s3:*",
//               "cloudwatch:*",
//               "ec2:*"
//           ],
//           "Resource": "*"
//       }
//   ]
// }


// [ ] 5.4.1  define Policy Boundary
// const boundary = (stackParam: IConstruct) => new cdk.aws_iam.ManagedPolicy(stackParam, 'permissions-boundary', {
//   statements: [
//     new cdk.aws_iam.PolicyStatement({
//       effect: cdk.aws_iam.Effect.DENY,
//       actions: ['iam:GetUser'],
//       resources: ['*'],
//     }),
//   ],
// })

// // [ ] 5.4.2 attach boundary to all constructs
// cdk.aws_iam.PermissionsBoundary
//   .of(backend)
//   .apply(boundary(backend))


// cdk.aws_iam.PermissionsBoundary
//   .of(api)
//   .apply(boundary(api))


// cdk.aws_iam.PermissionsBoundary
//   .of(webapp)
//   .apply(boundary(webapp))

// api depends on backend
