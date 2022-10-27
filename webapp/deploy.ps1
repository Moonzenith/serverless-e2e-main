
# read a json file
$WebappConfig=Get-Content -Raw -Path '..\webapp.json' | ConvertFrom-Json -Depth 4

# get bucket name from json and append s3:// then store that in a vble
$bucketName="s3://" + $WebappConfig.webapp.webappBucketName

# get distribution id from json and store it in a vble
$distributionId=$WebappConfig.webapp.distributionId


# copy webapp.json to webapp folder
Copy-Item -Path ..\api.json -Destination .
# Copy-Item -Path ..\webapp.json -Destination . # this might not be needed here


#  [ ] 1.1.2: add command to update web assets in S3 [docs](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html)
Write-Host 'Uploading assets to' + $bucketName

# this use the stored bucket name
aws s3 cp . $bucketName --recursive


#  [ ] 1.2.2: add command to invalidate cloudfront distribution [docs](https://docs.aws.amazon.com/cli/latest/reference/cloudfront/create-invalidation.html)
Write-Host 'Deleting cache for distribution id =' + $distributionId

# this use the stored distribution id
aws cloudfront create-invalidation --distribution-id $distributionId --paths '/*'

