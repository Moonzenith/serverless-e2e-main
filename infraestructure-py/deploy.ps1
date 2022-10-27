
cdk bootstrap

## BACKEND

# running cdk synth on backend stack
Write-Output "running cdk synth on backend stack"
cdk synth backend

# running cfn-guard on backend stack
Write-Output "running cfn-guard on backend stack"
cfn-guard validate -d .\cdk.out\backendStack.template.json -r .\rules\backend.rules

# deploy backend stack and save backend.json on root folder
Write-Output "deploy backend stack and save backend.json on root folder"
cdk deploy backend -O ../backend.json


## API

# running cdk synth on api stack
Write-Output "running cdk synth on api stack"
cdk synth api

# running cfn-guard on api stack
Write-Output "running cfn-guard on api stack"
cfn-guard validate -d .\cdk.out\backendStack.template.json -r .\rules\api.rules

# deploy api stack and save api.json on root folder
Write-Output "deploy api stack and save api.json on root folder"
cdk deploy api -O ../api.json


## WEBAPP

# running cdk synth on webapp stack
Write-Output "running cdk synth on webapp stack"
cdk synth webapp

# running cfn-guard on webapp stack
Write-Output "running cfn-guard on webapp stack"
cfn-guard validate -d .\cdk.out\webappStack.template.json -r .\rules\webapp.rules

# deploy webapp stack and save webapp.json on root folder
Write-Output "deploy webapp stack and save webapp.json on root folder"
cdk deploy webapp -O ../webapp.json


## APIDOC

# running cdk synth on apidoc stack
Write-Output "running cdk synth on apidoc stack"
cdk synth apidoc

# running cfn-guard on apidoc stack
Write-Output "running cfn-guard on apidoc stack"
cfn-guard validate -d .\cdk.out\webappStack.template.json -r .\rules\apidoc.rules

# deploy apidoc stack and save apidoc.json on root folder
Write-Output "deploy apidoc stack and save apidoc.json on root folder"
cdk deploy apidoc -O ../apidoc.json
