from aws_cdk import (
    # Duration,
    CfnOutput,
    Stack,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as cloudfront_origins,
    RemovalPolicy,
)
from constructs import Construct

class WebappStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)


        # [ ] 1.1.1: create S3 Bucket as web hosting to store webapp [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-s3-readme.html)
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

        CfnOutput(self, 'webappBucketName', value= webapp_bucket.bucket_name)

        # [ ] 1.2.1: create CloudFront distribution [docs](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-cloudfront-readme.html)

        # to allow access to s3 from cloudfront
        origin_access_identity = cloudfront.OriginAccessIdentity(self, 'OriginAccessIdentity')
        webapp_bucket.grant_read(origin_access_identity)

        cdn_distribution = cloudfront.Distribution(self, 'WebappDistribution',
            default_root_object='index.html',
            default_behavior=cloudfront.BehaviorOptions(
                origin=cloudfront_origins.S3Origin(webapp_bucket, origin_access_identity=origin_access_identity)
            )

        )
        
        CfnOutput(self, 'webappDnsUrl', value= cdn_distribution.distribution_domain_name)
        CfnOutput(self, 'distributionId', value= cdn_distribution.distribution_id)
