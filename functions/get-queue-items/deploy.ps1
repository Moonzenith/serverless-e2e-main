

# test function
npm run test

# read a json file
$config=Get-Content -Raw -Path '..\api.json' | ConvertFrom-Json -Depth 4

Write-Output "updating function" $config.api.createOrderLambda

$exists=Test-Path .\function.zip
if ($exists) { 
    Remove-Item .\function.zip
}

Compress-Archive -Path .\*.js -DestinationPath .\create-order
aws lambda update-function-code --function-name $config.api.createOrderLambda --zip-file fileb://create-order.zip