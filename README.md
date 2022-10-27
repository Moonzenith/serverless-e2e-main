# Serverless E2E



## **Index:**
1. **Webapp:**
    1. **Hosting (S3):** where to store app assets?
       1. [ ] 1.1.1: create S3 Bucket as web hosting to store webapp [description](#1-1-1) [ts](./infraestructure/lib/webapp-stack.ts) [py](./infraestructure-python/infraestructure_python/webapp_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-s3-readme.html)
       2. [ ] 1.1.2: add command to update web assets in S3 [posh](./webapp/deploy.ps1) [bash](./webapp/deploy.sh)  [docs](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html)
    2. **CDN (CloudFront):** How to distribute assets across the globe?
       1. [ ] 1.2.1: create CloudFront distribution [ts](./infraestructure/lib/webapp-stack.ts) [py](./infraestructure-python/infraestructure_python/webapp_stack.py)  [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-cloudfront-readme.html)
       2. [ ] 1.2.2: add command to invalidate cloudfront distribution [posh](./webapp/deploy.ps1) [bash](./webapp/deploy.sh)  [docs](https://docs.aws.amazon.com/cli/latest/reference/cloudfront/create-invalidation.html)
    3. **DNS (Route53):** how to set up DNS? -- optional
       1. [o] create CDK record set (optional, we may not have access to a domain)
2. **REST API:**
    1. **handlers**
       1. [ ] 2.1.1: create lambdas for getOrders [ts](./infraestructure/lib/api-stack.ts) [py](./infraestructure-python/infraestructure_python/api_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda.Function.html)
       2. [ ] 2.1.2: create lambdas for createOrder [ts](./infraestructure/lib/api-stack.ts) [py](./infraestructure-python/infraestructure_python/api_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda.Function.html)
       3. [ ] 2.1.3: create lambdas for updateOrder [ts](./infraestructure/lib/api-stack.ts) [py](./infraestructure-python/infraestructure_python/api_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda.Function.html)
    2. **API (CDK):**
       1. [ ] 2.2.1: create api [ts](./infraestructure/lib/api-stack.ts) [py](./infraestructure-python/infraestructure_python/api_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-apigateway.RestApi.html)
       2. [ ] 2.2.2: create /orders resource [POST, GET] [ts](./infraestructure/lib/api-stack.ts) [py](./infraestructure-python/infraestructure_python/api_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-apigateway.IResource.html#addwbrmethodhttpmethod-target-options)
       3. [ ] 2.2.3: create /orders/{customer}/{id} [ts](./infraestructure/lib/api-stack.ts) [py](./infraestructure-python/infraestructure_python/api_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-apigateway.IResource.html#addwbrresourcepathpart-options)
    3. **webapp**
       1. [ ] 2.3.1: get orders from api [js](./webapp/src/index.js) [docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
       2. [ ] 2.3.2: send the order to the api [js](./webapp/src/index.js) [docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options)
3. **Database:**
    1. **DynamoDB:**
       1. [ ] 3.1.1: create DynamoDB orders table [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-dynamodb-readme.html)
       2. [ ] 3.1.2: connect api to dynamodb [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.Table.html#static-fromwbrtablewbrarnscope-id-tablearn)
    2. **handlers:**
       1. [ ] 3.2.1: use table on getOrders - get all orders from dynamodb [js](./functions/get-orders/index.js) [docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property)
       2. [ ] 3.3.2: use table on createOrder - save order on dynamodb table [js](./functions/create-orders/index.js) [docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property)
       3. [ ] 3.2.3: use table on updateOrder - patch an order on dynamodb table [js](./functions/update-orders/index.js) [docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property)
4. **Backend processes:**
    1. **app integration:**
       1. [ ] 4.1.1: create processing orders queue [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-sqs.Queue.html)
       2. [ ] 4.1.2: create user notification topic (sns) [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-sns.Topic.html)
    2. **Handlers** 
       1. [ ] 4.2.1: create a lambda to handle dynamodb stream [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda.Function.html)
       2. [ ] 4.2.2: create a lambda to handle sqs messages [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda.Function.html)
    3. **assign handlers:** 
       1. [ ] 4.3.1: set lambda 4.2.1 as handler for dynamodb table updates [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda.Function.html#addwbreventwbrsourcesource)
       2. [ ] 4.3.2: set lambda 4.2.2 as handler for sqs queue messages [ts](./infraestructure/lib/backend-stack.ts) [py](./infraestructure-python/infraestructure_python/backend_stack.py) [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lambda-event-sources-readme.html)
5.  **Security:**
    1. **Web App Access Control (Custom auth):** How to secure app?
       1. [ ] create authenticate lambda function
       2. [ ] create an endpoint for authentication
    2. **API Access Control (Custon authorizer):**
       1. [ ] create the custom authorizer
       2. [ ] add authorizer to private endpoints
    3. **webapp authorization**
        1. [ ] use `Authorization` header on http getOrders
        2. [ ] use `Authorization` header on http createOrder
    4. **Permission Boundaries**
        1. [ ] define Policy Boundary
        2. [ ] attach boundary to all constructs


--- 

# Chapter breakdown

## 1 Webapp
Our goal is to deploy a basic single page application to the web, we want to make it avaiable across multiple edge locations so customer will have a fast and reliable experience

### 1-1 Hosting
For hosting we will be using an [S3 bucket](https://aws.amazon.com/s3/) wich a cost efective and reliable object store.

#### 1-1-1
Using the CDK create an s3 bucket inside the webapp stack file in either [TypeScripr](./infraestructure/lib/webapp-stack.ts) or [Python](./infraestructure-python/infraestructure_python/webapp_stack.py)

#### 1-1-2
Using AWS CLI call the command to upload all the relevant files to the S3 bucket you created on the previous step

### 1-2 CDN
We will set up a Content Delivery Network to distribute static files (webapp) close to the final customer.
For this task we will be leveraging [CloudFront](https://aws.amazon.com/cloudfront/)

#### 1-2-1


#### 1-2-2