# Serverless e2e Immersion Day
Welcome to the Serverless End to End immersion day.

We invite you to join us on an adventure where we discover how a modern application comes to life. Our journey will begin in the browser, where we will deliver the best possible experience to our customers by leveraging the most up-to-date features modern browsers have to offer.

The next stop on our trip will be in the AWS cloud where we will open the gates to our webapp, allowing it to talk to our backends.

Next, let’s make it persistent. We will be exploring Serverless databases to allow us to scale as needed with no downtime. Only have a few users? No problem. A few million users? Still no problem. Code once, and scale in and out as you please.

Is that it?!

Well... no.

We will next discover the wonders of event driven architectures, where instead of coordinating steps between multiple systems, we will enable systems to subscribe to the event sources they need. This allows for flexible architecture that can change as the business needs change. You might be wondering - how can we protect all that we have created?? Don’t worry, we have you covered. In the last stage of our journey, we will secure our application and infrastructure so that we can sleep in peace.

Get ready for the adventure!!




# Before we begin:
In order to properly run this lab, we will be using the first hour to install the following applications:
- [VS code](https://code.visualstudio.com/download) Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.
- [Git client](https://git-scm.com/download/win) Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.
- [Node.js v14](https://nodejs.org/en/download/) As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions) The AWS Command Line Interface (AWS CLI) is a unified tool to manage your AWS services. With just one tool to download and configure, you can control multiple AWS services from the command line and automate them through scripts.
- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) The AWS Cloud Development Kit (AWS CDK) is an open-source software development framework to define your cloud application resources using familiar programing languages.
- [CFN Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/installing-cfn-guard-cli.html) AWS CloudFormation Guard is a policy-as-code evaluation tool that is open source and useful for general purposes. The Guard command line interface (CLI) provides you with a declarative domain-specific language (DSL) that you can use to express policy as code.
- [Powershell v7](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2)


# Agenda

### Day 1
- Account setup
- Introdunction to serverless
- Progressive Web Applications
- Serverles Rest APIs on AWS
- Q&A 30m

### Day2
- Welcome back
- Serverless Databases
- Integration Services
- Security
- Q&A
- Wrap up




# Project Set Up
1. clone [Serverless-e2e-lab](https://github.com/diegotorres03/serverless-e2e-lab) by running `git clone https://github.com/diegotorres03/serverless-e2e-lab.git`  in Powershell.


# 1.1.1: `create S3 Bucket as web hosting to store webapp`

**description:** In this task, you are required to create an [Amazon S3](https://aws.amazon.com/s3/) bucket to store the static assets for your web application. Then create a bucket deployment to deploy the initial version of the web application. 

**go to files:** [ts](./infraestructure/lib/webapp-stack.ts) | [py](./infraestructure-py/infraestructure_python/webapp_stack.py)


**documentaion:**
- AWS CDK S3 Bucket [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3-readme.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_s3.html)

- AWS CDK S3 Deployment [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3_deployment-readme.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_s3_deployment.html)

**file:** `./infraestructure/lib/webapp-stack.ts`
**replace key:** `// [ ] 1.1.1: create S3 Bucket as web hosting to store webapp`
```ts
        // [x] 1.1.1: create S3 Bucket as web hosting to store webapp
        const webappBucket = new S3.Bucket(this, 'webapp-artifact', {
            accessControl: S3.BucketAccessControl.PRIVATE,
            cors: [{
                allowedMethods: [S3.HttpMethods.GET],
                allowedOrigins: ['*'],

                // the properties below are optional
                allowedHeaders: ['Authorization'],
                exposedHeaders: [],
            }],
            removalPolicy: RemovalPolicy.DESTROY,
        })

        const webappDeployment = new S3Deployment.BucketDeployment(this, 'deployStaticWebapp', {
            sources: [S3Deployment.Source.asset(props?.assetsPath || '../webapp')],
            destinationBucket: webappBucket,
        })
        
        // export bucket Name
        new CfnOutput(this, 'webappBucketName', { value: webappBucket.bucketName })

```


**file:** `./infraestructure/lib/webapp-stack.ts`
**replace key:** `// imports`
```ts
    aws_cloudfront as CloudFront,
    aws_cloudfront_origins as CloudFrontOrigins,
    // imports
```



**file:** `./infraestructure-py/infraestructure_python/webapp_stack.py`
**replace key:** `# [ ] 1.1.1: create S3 Bucket as web hosting to store webapp`
```py
        # [x] 1.1.1: create S3 Bucket as web hosting to store webapp
        webapp_bucket = s3.Bucket(self, "webapp_bucket", 
            cors=[
                s3.CorsRule(
                    allowed_headers=['Autorization'],
                    allowed_origins=['*'],
                    allowed_methods=[s3.HttpMethods.HEAD, s3.HttpMethods.GET],
                    exposed_headers=[]
                )
            ],
            removal_policy=RemovalPolicy.DESTROY
        )
        # TODO: add the deployment part
        CfnOutput(self, 'webappBucketName', value= webapp_bucket.bucket_name)

```


**file:** `./infraestructure-py/infraestructure_python/webapp_stack.py`
**replace key:** `# imports`
```py
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as cloudfront_origins,
    # imports
```



---

# 1.1.2: `add command to update web assets in S3`

**description:** Once our bucket is created, we need a way to allow our web developers to publish their code without re-deploying infraestructure, for this we will be using the AWS CLI to copy local files in to the desired bucket. 


**go to files:** [ps1](./webapp/deploy.ps1)


**documentaion:**
- [AWS CLI S3](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/cp.html) 

**file:** `./webapp/deploy.ps1`
**replace key:** `#  [ ] 1.1.2: add command to update web assets in S3`
```posh
#  [x] 1.1.2: add command to update web assets in S3
aws s3 cp . $bucketName --recursive
```

---


# 1.2.1: `create CloudFront distribution`

**description:** Now that the webapp is stored on a bucket, we need a way to make it accesible from the web. Instead mo making the bucket publick, we will leverage [Amazon CloudFront](https://aws.amazon.com/cloudfront/), wich is a Content Delivery Netwerk (CDN).
So now we need to create a cloudfront origin and a cloudfront distribution.
The origin will point to the `index.html` inside the bucket, then inside the distribution add this origin so cloudfront will know where to get the assets.


**go to files:** [ts](./infraestructure/lib/webapp-stack.ts) | [py](./infraestructure-py/infraestructure_python/webapp_stack.py)


**documentaion:**
- Cloudfront Origin Access Identity [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.OriginAccessIdentity.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_cloudfront/OriginAccessIdentity.html) 
- Cloudfront Distribution [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Distribution.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_cloudfront/Distribution.html)


**file:** `./infraestructure/lib/webapp-stack.ts`
**replace key:** `// [ ] 1.2.1: create CloudFront distribution`
```js
        // [x] 1.2.1: create CloudFront distribution
        const originAccessIdentity = new CloudFront.OriginAccessIdentity(this, 'OriginAccessIdentity')
        
        // allow clowdfront to read s3 webpp files
        webappBucket.grantRead(originAccessIdentity)

        const cdnDistribution = new CloudFront.Distribution(this, 'WebappDistribution', {
            defaultRootObject: 'index.html',

            defaultBehavior: {
                origin: new CloudFrontOrigins.S3Origin(webappBucket, { originAccessIdentity })
            }
        })
    
        // export webapp dns url
        new CfnOutput(this, 'webappDnsUrl', { value: cdnDistribution.distributionDomainName })
        new CfnOutput(this, 'distributionId', { value: cdnDistribution.distributionId })

```


**file:** `./infraestructure-py/infraestructure_python/webapp_stack.py`
**replace key:** `# [ ] 1.2.1: create CloudFront distribution`
```py
        # [x] 1.2.1: create CloudFront distribution
        origin_access_identity = cloudfront.OriginAccessIdentity(self, 'OriginAccessIdentity')
        
        # to allow access to s3 from cloudfront
        webapp_bucket.grant_read(origin_access_identity)

        cdn_distribution = cloudfront.Distribution(self, 'WebappDistribution',
            default_root_object='index.html',
            default_behavior=cloudfront.BehaviorOptions(
                origin=cloudfront_origins.S3Origin(webapp_bucket, origin_access_identity=origin_access_identity)
            )
        )
        
        CfnOutput(self, 'webappDnsUrl', value= cdn_distribution.distribution_domain_name)
        CfnOutput(self, 'distributionId', value= cdn_distribution.distribution_id)

```


---

# 1.2.2: `add command to invalidate cloudfront distribution`


**description:** Since Cloudfront create a cache with the webapp and replicate it across the glove. We need to delete that cache when a new version is released in order to see instantly the new version online.
Use the AWS CLI to create an invalidation.


**go to files:** [ps1](./webapp/deploy.ps1)


**documentaion:**
- [Create Invalidation](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/cloudfront/create-invalidation.html) 

**file:** `./webapp/deploy.ps1`
**replace key:** `#  [ ] 1.2.2: add command to invalidate cloudfront distribution`
```powershell
#  [x] 1.2.2: add command to invalidate cloudfront distribution
aws cloudfront create-invalidation --distribution-id $distributionId --paths '/*'
```

_note: then next updates are set up for next chapter_

**file:** `./infraestructure/bin/infraestructure.ts`
**replace key:** `// imports`
```ts
import { RestApiStack } from '../lib/api-stack'
// imports
```

**file:** `./infraestructure/bin/infraestructure.ts`
**replace key:** `// creating RestApiStack`
```ts
// creating RestApiStack
const api = new RestApiStack(app, 'api', {
    env: { region }
})
```

**file:** `./infraestructure-py/app.py`
**replace key:** `# imports`
```py
from infraestructure_python.api_stack import ApiStack
# imports
```

**file:** `./infraestructure-py/app.py`
**replace key:** `# creating RestApiStack`
```py
# creating RestApiStack
api = ApiStack(app, 'api', env=cdk.Environment(region=region))
```


---

# 2.1.1: `create lambdas for getOrders`


**description:** Now we will create the api that will handle all the orders from our webapp.
First we need to create the lambda functions that will handle each individual api route.
Let's begin with the `getOrders` function, on the CDK file, create a lambda function and set the code path to `../functions/get-orders`.


_runtime:_ `node 14`


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- Lambda Function  [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html) 


**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 2.1.1: create lambdas for getOrders`
```ts
        // [x] 2.1.1: create lambdas for getOrders
        const getOrdersLambda = new Lambda.Function(this, 'getOrders', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: Lambda.Code.fromAsset('../functions/get-orders'),
            environment: { /* 3.1.2 */ }
        })
        new CfnOutput(this, 'getOrdersLambda', { value: getOrdersLambda.functionName })
```

**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 2.1.1: create lambdas for getOrders`
```py
        # [x] 2.1.1: create lambdas for getOrders
        get_orders_lambda = lambda_.Function(self, 'getOrders',
            runtime=lambda_.Runtime.NODEJS_16_X,
            handler='index.handler',
            code=lambda_.Code.from_asset('../functions/get-orders')
        )
        # 3.1.2
        # orders_table.grant_read_write_data(get_orders_lambda)
        
        CfnOutput(self, 'get_orders_lambda', value= get_orders_lambda.function_name)

```


---

# 2.1.2: `create lambdas for createOrder`


**description:** Let's now create the `createOrder` function, on the CDK file, create a lambda function and set the code path to `../functions/create-order`.


_runtime:_ `node 14`


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- Lambda Function  [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html) 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 2.1.2: create lambdas for createOrder`
```ts
        // [x] 2.1.2: create lambdas for createOrder
        const createOrderLambda = new Lambda.Function(this, 'createOrder', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: Lambda.Code.fromAsset('../functions/create-order'),
            environment: {  /* 3.1.2 */  }
        })
        new CfnOutput(this, 'createOrderLambda', { value: createOrderLambda.functionName })

```

**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 2.1.2: create lambdas for createOrder`
```py
        # [x] 2.1.2: create lambdas for createOrder
        create_orders_lambda = lambda_.Function(self, 'createOrder',
            runtime=lambda_.Runtime.NODEJS_16_X,
            handler='index.handler',
            code=lambda_.Code.from_asset('../functions/create-order'),
        )
        # 3.1.2
        # create_orders_lambda.add_environment('ORDERS_TABLE', orders_table.table_name)
        # orders_table.grant_read_write_data(create_orders_lambda)
        CfnOutput(self, 'create_orders_lambda', value= create_orders_lambda.function_name)

```

---

# 2.1.3: `create lambdas for updateOrder`


**description:** Let's create the last function `updateOrder`, on the CDK file, create a lambda function and set the code path to `../functions/update-order`.


_runtime:_ `node 14`


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)

**documentaion:**
- Lambda Function [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html) 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 2.1.3: create lambdas for updateOrder`
```ts
        // [x] 2.1.3: create lambdas for updateOrder
        const updateOrderLambda = new Lambda.Function(this, 'updateOrder', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: Lambda.Code.fromAsset('../functions/update-order'),
            environment: { /* 3.1.2 */ }
        })
        new CfnOutput(this, 'updateOrderLambda', { value: updateOrderLambda.functionName })

```

**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 2.1.3: create lambdas for updateOrder`
```py
        # [x] 2.1.3: create lambdas for updateOrder
        update_orders_lambda = lambda_.Function(self, 'updateOrder',
            runtime=lambda_.Runtime.NODEJS_16_X,
            handler='index.handler',
            code=lambda_.Code.from_asset('../functions/update-order')
        )
        # 3.1.2
        # update_orders_lambda.add_environment('ORDERS_TABLE', orders_table.table_name)
        # orders_table.grant_read_write_data(update_orders_lambda)
        CfnOutput(self, 'update_orders_lambda', value= update_orders_lambda.function_name)

    
```


---

# 2.2.1: `create api`


**description:** Great Job! we jsut created all the lambda functions required to list, create and update orders. Now we need a way to call those functions.
To achieve this, we will create a Rest API using [Amazon API Gateway](https://aws.amazon.com/api-gateway/)


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- Rest API [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.RestApi.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/RestApi.html) 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 2.2.1: create api`
```ts
        // [x] 2.2.1: create api
        const api = new ApiGateway.RestApi(this, 'ordersApi', {
            description: 'handle api calls from webapp',
            deployOptions: { stageName: 'dev' },
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                    'Access-Control-Allow-Headers',
                    "Access-Control-Allow-Origin",
                    "Access-Control-Allow-Methods",
                ],
                allowOrigins: ApiGateway.Cors.ALL_ORIGINS,
                allowMethods: ApiGateway.Cors.ALL_METHODS,
                allowCredentials: true,
            },
        })

        new CfnOutput(this, 'apiUrl', { value: api.url })

```


**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 2.2.1: create api`
```py
        # [x] 2.2.1: create api
        api = apigateway.RestApi(self, 'ordersApi',
            description='handle api calls from webapp',
            deploy_options=apigateway.StageOptions(stage_name='dev'),
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_headers=[
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                    'Access-Control-Allow-Headers',
                    "Access-Control-Allow-Origin",
                    "Access-Control-Allow-Methods"
                ],
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_credentials=True
            )
        )
        CfnOutput(self, 'apiUrl',value= api.url)
```

---

# 2.2.2: `create /orders resource [POST, GET]`


**description:** Our Api is ready, let's add `/orders` resource with 2 methods [`POST`, `GET`]. 


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- API Resource [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Resource.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/Resource.html)
- API Resource Method [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Method.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/Method.html)
- API Lambda Integration [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.LambdaIntegration.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/LambdaIntegration.html)

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 2.2.2: create /orders resource [POST, GET]`
```ts
        // [x] 2.2.2: create /orders resource [POST, GET]
        const ordersEndpoint = api.root.addResource('orders')
        ordersEndpoint.addMethod('GET', new ApiGateway
            .LambdaIntegration(getOrdersLambda, { proxy: true }), /* 5.2.2 */)
        ordersEndpoint.addMethod('POST', new ApiGateway
            .LambdaIntegration(createOrderLambda, { proxy: true }), /* 5.2.2 */)

```


**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 2.2.2: create /orders resource [POST, GET]`
```py
        # [x] 2.2.2: create /orders resource [POST, GET]
        orders_endpoint = api.root.add_resource('orders')
        orders_endpoint.add_method('GET', apigateway.LambdaIntegration(get_orders_lambda, proxy=True))
        orders_endpoint.add_method('POST', apigateway.LambdaIntegration(create_orders_lambda, proxy=True))
       
```


---

# 2.2.3: `create /orders/{customer}/{id}`


**description:** Now, we are just missing the endpoint `/orders/{customer}/{id}`, here we will make [`PATCH`] request to update an order, 


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- API Resource [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Resource.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/Resource.html)
- API Resource Method [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Method.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/Method.html)
- API Lambda Integration [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.LambdaIntegration.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/LambdaIntegration.html)

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 2.2.3: create /orders/{customer}/{id}`
```ts
        // [x] 2.2.3: create /orders/{customer}/{id}
        const singleOrderEndpoint = ordersEndpoint.addResource('{customer}').addResource('{id}')
        singleOrderEndpoint
            .addMethod('PATCH', new ApiGateway
            .LambdaIntegration(updateOrderLambda, { proxy: true }), /* 5.2.2 */)

```


**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 2.2.3: create /orders/{customer}/{id}`
```py
        # [x] 2.2.3: create /orders/{customer}/{id}
        single_order_endpoint = orders_endpoint.add_resource('{customer}').add_resource('{id}')
        single_order_endpoint.add_method('PATCH', apigateway.LambdaIntegration(update_orders_lambda, proxy=True))

```


---

# 2.3.1: `get orders from api`


**description:** Now let's connect the webapp and the newly created api.
Here we want to start by listing all the orders by doing a get request to the `getOrders` endpoint.


**go to files:** [js](./webapp/src/web-worker.js)


**documentaion:**
- [js fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 

**file:** `./webapp/src/web-worker.js`
**replace key:** `// [ ] 2.3.1: get orders from api`
```js
            // [x] 2.3.1: get orders from api
            orders = await fetch(url, {
                'Content-Type': 'application/json', // 'text/html',
                // [ ] 5.3.1 use Authorization header on http getOrders
            })
```


---

# 2.3.2: `send the order to the api`


**description:** Now, we want to be able to send a new order to the api, we will use the same JS Fetch api to `POST` the new order.


**go to files:** [js](./webapp/src/web-worker.js)


**documentaion:**
- [js fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 


**file:** `./webapp/src/web-worker.js`
**replace key:** `// [ ] 2.3.2: send the order to the api`
```js
            // [x] 2.3.2: send the order to the api
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    id: order.id,
                    customer: order.customer,
                    items: order.items,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    // [ ] 5.3.2 use Authorization header on http createOrder
                }
            }

            await fetch(url, options)
```

_note: then next updates are set up for next chapter_

**file:** `./infraestructure/bin/infraestructure.ts`
**replace key:** `// imports`
```ts
import { BackendStack } from '../lib/backend-stack'
// imports
```

**file:** `./infraestructure/bin/infraestructure.ts`
**replace key:** `// creating BackendStack`
```ts
// creating BackendStack
const backend = new BackendStack(app, 'backend', {
    env: { region }
})
```


**file:** `./infraestructure-py/app.py`
**replace key:** `# imports`
```py
from infraestructure_python.backend_stack import BackendStack
# imports
```

**file:** `./infraestructure-py/app.py`
**replace key:** `# creating RestApiStack`
```py
# creating RestApiStack
backend = BackendStack(app, 'backend', env=cdk.Environment(region=region))
```



---

# 3.1.1: `create DynamoDB orders table`


**description:** So far, we have been simulating the creation and listing of orders, but we don't have a place to store them, let's now create a [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) Table. 
Important to keep in mind, lets create a partitionKey key `customer` and a sort key `id`, both strigs.
We also need to specify a `timeToLiveAttribute` that you will find as a variable on the file.
And finnaly, add a Stream by specifying the `stream` property on the Table constructor, we want to use `NEW_AND_OLD_IMAGES` value from `StreamViewType`.


**go to files:** [ts](./infraestructure/lib/backend-stack.ts) | [py](./infraestructure-py/infraestructure_python/backend_stack.py)


**documentaion:**
- DynamoDB Table [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb.Table.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_dynamodb/Table.html) 
- [How it works: DynamoDB Time to Live (TTL)](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/howitworks-ttl.html)

**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 3.1.1: create DynamoDB orders table`
```ts
        // [x] 3.1.1: create DynamoDB orders table
        const ordersTable = new DynamoDB.Table(this, 'orders', {
            partitionKey: { name: 'customer', type: DynamoDB.AttributeType.STRING },
            sortKey: { name: 'id', type: DynamoDB.AttributeType.STRING },
            billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
            stream: DynamoDB.StreamViewType.NEW_AND_OLD_IMAGES,
            timeToLiveAttribute,
            removalPolicy: RemovalPolicy.DESTROY,
        })

```


**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 3.1.1: create DynamoDB orders table`
```py
        # [x] 3.1.1: create DynamoDB orders table
        orders_table = dynamo.Table(self, 'orders',
            partition_key=dynamo.Attribute(name='customer', type=dynamo.AttributeType.STRING),
            sort_key=dynamo.Attribute(name='id', type=dynamo.AttributeType.STRING),
            billing_mode=dynamo.BillingMode.PAY_PER_REQUEST,
            stream=dynamo.StreamViewType.NEW_AND_OLD_IMAGES,
            time_to_live_attribute=time_to_live_attribute,
            removal_policy=RemovalPolicy.DESTROY
        )
```


---

# 3.1.2: `connect api to dynamodb`


**description:** Now that or Table is created, we need to do some steps in order to use it on the api.
Orders table was declared on `backend stack` but we will need a reference on `api stack`, to achieve this, we need to export the table arn and or table name.
Once exported, we will need to import it on the `api stack` and pass the `tableName` value as enviroment variable for `getOrders` `createOrder` and `updateOrder` functions.
Don't forget to grant read, write access crom dynamo to the respective lambda function.


**go to files:** 
- Backend Stack [ts](./infraestructure/lib/backend-stack.ts) | [py](./infraestructure-py/infraestructure_python/backend_stack.py)
- Api Stack [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- export CfnOutput [TypeScript](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_core.CfnOutput.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk/CfnOutput.html)
- import value [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Fn.html) | [Python](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.core/Fn.html)
- Lambda enviroment variables [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html#environment) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html#aws_cdk.aws_lambda.Function.add_environment)

**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 3.1.2: connect api to dynamodb`
```ts
        // [x] 3.1.2: connect api to dynamodb
        new CfnOutput(this, 'ordersTableName', {
            value: ordersTable.tableName,
            exportName: 'ordersTableName'
        })
        new CfnOutput(this, 'ordersTableArn', {
            value: ordersTable.tableArn,
            exportName: 'ordersTableArn'
        })
```


**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 3.1.2: connect api to dynamodb`
```ts
        // [x] 3.1.2: connect api to dynamodb
        const ordersTableArn = Fn.importValue('ordersTableArn')
        const ordersTable = DynamoDB.Table.fromTableArn(this, 'ordersTable', ordersTableArn)

```

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `/* 3.1.2 */`
```ts
ORDERS_TABLE: ordersTable.tableName   
```

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 3.1.2: grant lambda access to dynamo table`
```ts
        // [x] 3.1.2: grant lambda access to dynamo table 
        ordersTable.grantReadWriteData(createOrderLambda)
        ordersTable.grantReadWriteData(getOrdersLambda)
        ordersTable.grantReadWriteData(updateOrderLambda)   
```


**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 3.1.2: connect api to dynamodb`
```py
        # [x] 3.1.2: connect api to dynamodb
        CfnOutput(self, 'ordersTableName-py', 
            export_name='ordersTableName-py', 
            value= orders_table.table_name
        )

        CfnOutput(self, 'ordersTableArn-py', 
            export_name='ordersTableArn-py', 
            value= orders_table.table_arn
        )

```

**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 3.1.2: connect api to dynamodb`
```py
        # [x] 3.1.2: connect api to dynamodb
        orders_table_arn = Fn.import_value('ordersTableArn-py')
        orders_table = dynamo.Table.from_table_arn(self, 'ordersTable', orders_table_arn)

```


**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 3.1.2: grant lambda access to dynamo table `
```py
        # [ ] 3.1.2: grant lambda access to dynamo table 
        orders_table.grant_read_write_data(get_orders_lambda)
        orders_table.grant_read_write_data(create_orders_lambda)
        orders_table.grant_read_write_data(update_orders_lambda)

```


---

# 3.2.1: `use table on getOrders - get all orders from dynamodb`


**description:** now that table and lambdas are connected, and proper access control is in place, let's run a `scan` to get the current orders


**go to files:** [js](./functions/get-orders/index.js)


**documentaion:**
- [AWS SDK DynamoDB.DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) 

**file:** `./functions/get-orders/index.js`
**replace key:** `// [ ] 3.2.1: use table on getOrders - get all orders from dynamodb`
```js
    // [x] 3.2.1: use table on getOrders - get all orders from dynamodb
    const res = await dynamo.scan({
        TableName: ordersTable,
    }).promise()
    
    orders = res.Items.map(item => new Order(item))

```


---

# 3.2.2: `use table on createOrder - put order on dynamodb table`


**description:** you know the drill. Perform a `put` operation on `ordersTable` to create the new order.


**go to files:** [js](./functions/create-order/index.js)


**documentaion:**
- [AWS SDK DynamoDB.DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

**file:** `./functions/create-order/index.js`
**replace key:** `// [ ] 3.2.2: use table on createOrder - put order on dynamodb table`
```js
    // [x] 3.2.2: use table on createOrder - put order on dynamodb table
    await dynamo.put({
        TableName: ordersTable,
        Item: order
    }).promise()

```


---

# 3.2.3: `use table on updateOrder - update an order on dynamodb table`


**description:** last step, let's `update` an order on `updateOrder` function.


**go to files:** [js](./functions/update-order/index.js)


**documentaion:**
- [AWS SDK DynamoDB.DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

**file:** `./functions/update-order/index.js`
**replace key:** `// [ ] 3.2.3: use table on updateOrder - update an order on dynamodb table`
```js
    // [x] 3.2.3: use table on updateOrder - update an order on dynamodb table
    response = await dynamo.update({
        TableName: ordersTable,
        Key: {
            id: orderId,
            customer: cusotmer,
        },
        ExpressionAttributeNames: { '#status': 'status', '#filledAt': '_filledAt' },
        ExpressionAttributeValues: { ':status': status, ':filledAt': _filledAt },
        UpdateExpression: `set #status = :status, #filledAt = :filledAt`,
    }).promise()

```


---

# 4.1.1: `create processing orders queue`


**description:** In this chapter we will se how to enable our opperation team to queue orders andnotify the user about the status of their meal.
First, lets create an [SQS Queue](https://aws.amazon.com/sqs/)


**go to files:** [TypeScript](./infraestructure/lib/backend-stack.ts) | [Python](./infraestructure-py/infraestructure_python/backend_stack.py)


**documentaion:**
- AWS SQS Queue [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs.Queue.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_sqs/Queue.html) 

**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 4.1.1: create processing orders queue`
```ts
        // [x] 4.1.1: create processing orders queue
        const ordersQueue = new SQS.Queue(this, 'ordersQueue', {
            visibilityTimeout: Duration.seconds(60)
        })

```


**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 4.1.1: create processing orders queue`
```py
        # [x] 4.1.1: create processing orders queue
        orders_queue = sqs.Queue(self, 'ordersQueue', 
            visibility_timeout=Duration.seconds(60)
        )

```


---

# 4.1.2: `create user notification topic (sns)`


**description:** An [SNS Topic](https://aws.amazon.com/sns/)


**go to files:** [ps1](./webapp/deploy.ps1)


**documentaion:**
- AWS SNS Topic [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sns.Topic.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_sns/Topic.html)

**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 4.1.2: create user notification topic (sns)`
```ts
        // [x] 4.1.2: create user notification topic (sns)
        const userNotificationTopic = new SNS.Topic(this, 'userNotification')

```


**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 4.1.2: create user notification topic (sns)`
```py
        # [x] 4.1.2: create user notification topic (sns)
        user_notification_topic = sns.Topic(self, 'userNotification')

```


---

# 4.2.1: `create a lambda to handle dynamodb stream`


**description:** . 


**go to files:** [TypeScript](./infraestructure/lib/backend-stack.ts) | [Python](./infraestructure-py/infraestructure_python/backend_stack.py)



**documentaion:**
- Lambda Function [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html) 

**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 4.2.1: create a lambda to handle dynamodb stream`
```ts
        // [x] 4.2.1: create a lambda to handle dynamodb stream
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

```


**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 4.2.1: create a lambda to handle dynamodb stream`
```py
        # [x] 4.2.1: create a lambda to handle dynamodb stream
        dynamo_lambda = lambda_.Function(self, 'dynamoHandler',
            runtime=lambda_.Runtime.NODEJS_16_X,
            code=lambda_.Code.from_asset('../functions/dynamo-handler'),
            handler='index.handler'
        )
        dynamo_lambda.add_environment('QUEUE', orders_queue.queue_url)
        dynamo_lambda.add_environment('TS_DB', '')
        dynamo_lambda.add_environment('TS_TABLE', '')
        CfnOutput(self, 'dynamoLambda-py', 
            value= dynamo_lambda.function_name
        )

```

---

# 4.2.2: `create a lambda to handle sqs messages`


**description:** . 


**go to files:** [TypeScript](./infraestructure/lib/backend-stack.ts) | [Python](./infraestructure-py/infraestructure_python/backend_stack.py)


**documentaion:**
- Lambda Function [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html) 
  
**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 4.2.2: create a lambda to handle sqs messages`
```ts
        // [x] 4.2.2: create a lambda to handle sqs messages
        const sqsLambda = new Lambda.Function(this, 'sqsHandler', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            code: Lambda.Code.fromAsset('../functions/sqs-handler'),
            handler: 'index.handler',
            environment: { QUEUE: ordersQueue.queueUrl },
        })
        new CfnOutput(this, 'sqsLambda', {
            value: sqsLambda.functionName,
        })

```


**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 4.2.2: create a lambda to handle sqs messages`
```py
        # [x] 4.2.2: create a lambda to handle sqs messages
        sqs_lambda = lambda_.Function(self, 'sqsHandler',
            runtime=lambda_.Runtime.NODEJS_16_X,
            code=lambda_.Code.from_asset('../functions/sqs-handler'),
            handler='index.handler'
        )
        sqs_lambda.add_environment('QUEUE', orders_queue.queue_url)
        CfnOutput(self, 'sqsLambda-py', 
            export_name='sqsLambda-py', 
            value= sqs_lambda.function_name
        )

```


---

# 4.3.1: `set lambda 4.2.1 as handler for dynamodb table updates`


**description:** . 


**go to files:** [TypeScript](./infraestructure/lib/backend-stack.ts) | [Python](./infraestructure-py/infraestructure_python/backend_stack.py)


**documentaion:**
- Lambda event sources [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources-readme.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda_event_sources.html) 

**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 4.3.1: set lambda 4.2.1 as handler for dynamodb table updates`
```ts
        // [x] 4.3.1: set lambda 4.2.1 as handler for dynamodb table updates
        ordersTable.grantStreamRead(dynamoLambda)
        dynamoLambda.addEventSource(new LambdaEventSources.DynamoEventSource(ordersTable, {
            startingPosition: Lambda.StartingPosition.TRIM_HORIZON,
            batchSize: 10,
        }))

```

**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 4.3.1: set lambda 4.2.1 as handler for dynamodb table updates`
```py
        # [x] 4.3.1: set lambda 4.2.1 as handler for dynamodb table updates
        orders_table.grant_stream_read(dynamo_lambda)

        dynamo_lambda.add_event_source(lambda_event_sources.DynamoEventSource(orders_table,
            starting_position=lambda_.StartingPosition.TRIM_HORIZON,
            batch_size=10
        ))

```


---

# 4.3.2: `set lambda 4.2.2 as handler for sqs queue messages`


**description:** 


**go to files:** [ts](./infraestructure/lib/backend-stack.ts) | [py](./infraestructure-py/infraestructure_python/backend_stack.py)


**documentaion:**
- Lambda event sources [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources-readme.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda_event_sources.html) 

**file:** `./infraestructure/lib/backend-stack.ts`
**replace key:** `// [ ] 4.3.2: set lambda 4.2.2 as handler for sqs queue messages`
```ts
        // [x] 4.3.2: set lambda 4.2.2 as handler for sqs queue messages
        ordersQueue.grantSendMessages(sqsLambda)
        sqsLambda.addEventSource(new LambdaEventSources.SqsEventSource(ordersQueue, {
            batchSize: 2,
        }))

```

**file:** `./infraestructure-py/infraestructure_python/backend_stack.py`
**replace key:** `# [ ] 4.3.2: set lambda 4.2.2 as handler for sqs queue messages`
```py
        # [x] 4.3.2: set lambda 4.2.2 as handler for sqs queue messages
        orders_queue.grant_send_messages(sqs_lambda)
        sqs_lambda.add_event_source(
            lambda_event_sources.SqsEventSource(orders_queue, batch_size= 2)
        )

```

_note: then next updates are set up for next chapter_



---

# 5.1.1: `create authenticate lambda function`


**description:** This lambda will verify user credentials and return a JSON Web Token (JWT). 


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- Lambda Function [TypeScript](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | [Python](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html) 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 5.1.1 create authenticate lambda function`
```ts
        // [x] 5.1.1 create authenticate lambda function
        const authenticateLambda = new Lambda.Function(this, 'authenticate', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            code: Lambda.Code.fromAsset('../functions/authenticate'),
            handler: 'index.handler',
        })
        new CfnOutput(this, 'authenticateLambda', { value: authenticateLambda.functionName })

```

**file:** `./infraestructure-py/infraestructure_python/api_stack.py`
**replace key:** `# [ ] 5.1.1 create authenticate lambda function`
```py
     
```

---

# 5.1.2: `create an endpoint for authentication`


**description:** in order to log in, we will require a new endpoint, you are familiar with this process, go ahead ;) 


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)




**documentaion:**
- topic [TypeScript]() | [Python]() 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 5.1.2 create an endpoint for authentication`
```ts
        // [x] 5.1.2 create an endpoint for authentication
        const authEndpoint = api.root
            .addResource('authenticate')
            .addMethod('POST', new ApiGateway.LambdaIntegration(authenticateLambda, { proxy: true }))
```


---

# 5.2.1: `create the custom authorizer`


**description:** An authorizer is a middleware on the api gateway that can verify a token/header to verify user is logged in and it has access to the requested resource. In this case for our custom authorizer, we will use a lambda function to verify the token.


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- topic [TypeScript]() | [Python]() 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 5.2.1 create the custom authorizer`
```ts
        // [x] 5.2.1 create the custom authorizer
        const authorizerLambda = new Lambda.Function(this, 'authorize', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            code: Lambda.Code.fromAsset('../functions/authorize'),
            handler: 'index.handler',
        })
        new CfnOutput(this, 'authorizerLambda', { value: authorizerLambda.functionName })

```


---

# 5.2.2: `add authorizer to private endpoints`


**description:** . 


**go to files:** [ts](./infraestructure/lib/api-stack.ts) | [py](./infraestructure-py/infraestructure_python/api_stack.py)


**documentaion:**
- topic [TypeScript]() | [Python]() 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 5.2.2 add authorizer to private endpoints`
```ts
        // [x] 5.2.2 add authorizer to private endpoints
        const authorizer = new ApiGateway.TokenAuthorizer(this, 'ordersAuthorizer', {
            handler: authorizerLambda
        })
```


**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `/* 5.2.2 */`
```ts
{ authorizer }
```



---

# 5.3.1: `use Authorization header on http getOrders`


**description:** . 


**go to files:** [js](./webapp/src/web-worker.js)


**documentaion:**
- [AWS CLI S3](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/cp.html) 

**file:** `./infraestructure/lib/api-stack.ts`
**replace key:** `// [ ] 5.3.1 use Authorization header on http getOrders`
```js
        // [x] 5.3.1 use Authorization header on http getOrders
        {
            headers: {
                'Authorization': token, //'json.web.token', 
            }
        }
```


---

# 5.3.2: `use Authorization header on http createOrder`


**description:** . 


**go to files:** [js](./webapp/src/web-worker.js)


**documentaion:**
- [AWS CLI S3](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/cp.html) 

**file:** `./webapp/src/web-worker.js`
**replace key:** `// [ ] 5.3.2 use Authorization header on http createOrder`
```js
// [ ] 5.3.2 use Authorization header on http createOrder
            'Authorization': 'json.web.token'
```


---

# 5.4.1: `define Policy Boundary`


**description:** . 


**go to files:** [ts](./infraestructure/bin/infraestructure.ts) | [py](./infraestructure-py/app.py)


**documentaion:**
- [AWS CLI S3](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/cp.html) 

**file:** `./infraestructure/bin/infraestructure.ts`
**replace key:** `// [ ] 5.4.1  define Policy Boundary`
```ts
// [x] 5.4.1  define Policy Boundary
const boundary = (stackParam: IConstruct) => new cdk.aws_iam.ManagedPolicy(stackParam, 'permissions-boundary', {
  statements: [
    new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.DENY,
      actions: ['iam:GetUser'],
      resources: ['*'],
    }),
  ],
})
```


---

# 5.4.2: `attach boundary to all constructs`


**description:** . 


**go to files:** [ts](./infraestructure/bin/infraestructure.ts) | [py](./infraestructure-py/app.py


**documentaion:**
- [AWS CLI S3](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/cp.html) 

**file:** `./infraestructure/bin/infraestructure.ts`
**replace key:** `// [ ] 5.4.2 attach boundary to all constructs`
```ts
// [x] 5.4.2 attach boundary to all constructs
cdk.aws_iam.PermissionsBoundary
  .of(backend)
  .apply(boundary(backend))


cdk.aws_iam.PermissionsBoundary
  .of(api)
  .apply(boundary(api))


cdk.aws_iam.PermissionsBoundary
  .of(webapp)
  .apply(boundary(webapp))

// done

```



---

# 0.0.0: `You are All set`

**file:** `./infraestructure/bin/infraestructure.ts`
**replace key:** `// done`
```ts
// done
```
