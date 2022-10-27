from aws_cdk import (
    # Duration,
    CfnOutput,
    Environment,
    Stack,
    aws_lambda as lambda_,
    aws_apigateway as apigateway,
    aws_dynamodb as dynamo,
    RemovalPolicy,
    Fn
)
from constructs import Construct

class ApiStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # [import value](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk/Fn.html#aws_cdk.Fn.import_value)
        # [add env variables to lambda](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html#aws_cdk.aws_lambda.Function.add_environment)
        # [ ] 3.1.2: connect api to dynamodb
        orders_table_arn = Fn.import_value('ordersTableArn-py')
        orders_table = dynamo.Table.from_table_arn(self, 'ordersTable', orders_table_arn)

        # [ ] 2.1.1: create lambdas for getOrders [docs](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html)
        get_orders_lambda = lambda_.Function(self, 'getOrders',
            runtime=lambda_.Runtime.NODEJS_16_X,
            handler='index.handler',
            code=lambda_.Code.from_asset('../functions/get-orders')
        )
        get_orders_lambda.add_environment('ORDERS_TABLE', orders_table.table_name)
        CfnOutput(self, 'get_orders_lambda', value= get_orders_lambda.function_name)


        # [ ] 2.1.2: create lambdas for createOrder [docs](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html)
        create_orders_lambda = lambda_.Function(self, 'createOrder',
            runtime=lambda_.Runtime.NODEJS_16_X,
            handler='index.handler',
            code=lambda_.Code.from_asset('../functions/create-order'),
        )
        create_orders_lambda.add_environment('ORDERS_TABLE', orders_table.table_name)
        CfnOutput(self, 'create_orders_lambda', value= create_orders_lambda.function_name)


        # [ ] 2.1.3: create lambdas for updateOrder [docs](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda/Function.html)
        update_orders_lambda = lambda_.Function(self, 'updateOrder',
            runtime=lambda_.Runtime.NODEJS_16_X,
            handler='index.handler',
            code=lambda_.Code.from_asset('../functions/update-order')
        )
        update_orders_lambda.add_environment('ORDERS_TABLE', orders_table.table_name)
        CfnOutput(self, 'update_orders_lambda', value= update_orders_lambda.function_name)

        # [ ] 3.1.2: grant lambda access to dynamo table 
        orders_table.grant_read_write_data(get_orders_lambda)
        orders_table.grant_read_write_data(create_orders_lambda)
        orders_table.grant_read_write_data(update_orders_lambda)

        # [ ] 2.2.1: create api [docs](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/RestApi.html)
        api = apigateway.RestApi(self, 'ordersApi',
            description='handle api calls from webapp',
            deploy_options=apigateway.StageOptions(stage_name='dev'),
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_headers=[
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_credentials=True
            )
        )
        CfnOutput(self, 'apiUrl',value= api.url)

        # [ ] 2.2.2: create /orders resource [POST, GET] [docs](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/IResource.html)
        orders_endpoint = api.root.add_resource('orders')
        orders_endpoint.add_method('GET', apigateway.LambdaIntegration(get_orders_lambda, proxy=True))
        orders_endpoint.add_method('POST', apigateway.LambdaIntegration(create_orders_lambda, proxy=True))

        # [ ] 2.2.3: create /orders/{customer}/{id} [docs](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_apigateway/IResource.html)
        single_order_endpoint = orders_endpoint.add_resource('{customer}').add_resource('{id}')
        single_order_endpoint.add_method('PATCH', apigateway.LambdaIntegration(update_orders_lambda, proxy=True))


