#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { 
  WebAppStack,
  RestApiStack,
  BackendStack,
} from '../lib/infraestructure-stack'

const app = new cdk.App()


// creating WebAppStack
const apidoc = new WebAppStack(app, 'apidoc', {
  env: {    region: process.env.AWS_REGION },
  assetsPath: '../apidoc'
})

// creating WebAppStack
const webapp = new WebAppStack(app, 'webapp', {
  env: {    region: process.env.AWS_REGION },
  assetsPath: '../webapp'
})

// creating RestApiStack
const restApi = new RestApiStack(app, 'api', {
  env: {
    region: process.env.AWS_REGION,
  }
})


// creating BackendStack
const backend = new BackendStack(app, 'backend', {
  env: {
    region: process.env.AWS_REGION,
  }
})
