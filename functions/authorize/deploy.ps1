
# read a json file
$Config = Get-Content -Raw -Path '..\api.json' | ConvertFrom-Json -Depth 4

$functionName = $Config.api.authorizerLambda

Write-Output "updating function" $functionName

$exists=Test-Path .\function.zip
if ($exists) { 
    Remove-Item .\function.zip
}

Compress-Archive -DestinationPath function.zip -Path ./* -Force
Write-Output "functionName"
Write-Output $functionName
# [o] https://docs.aws.amazon.com/cli/latest/reference/lambda/update-function-code.html
aws lambda update-function-code --function-name $functionName --zip-file fileb://function.zip --region us-east-2
