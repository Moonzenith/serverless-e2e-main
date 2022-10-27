#!/bin/bash  
distributionId=$(grep -oP '"distributionId": "\K[A-Z0-9a-z]{14}' ../webapp.json)
webappBucketName=$(grep -oP '"webappBucketName": "\K[A-Z0-9a-z]{14}' ../webapp.json)
echo $distributionId
echo $webappBucketName

#  [ ] 1.1.2: add command to update web assets in S3 [docs](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html)
# aws s3 cp index.html s3://___bucket_name___
#
#  [ ] 1.2.2: add command to invalidate cloudfront distribution
# aws cloudfront create-invalidation --distribution-id ___distribution_id___ --paths '/*'
