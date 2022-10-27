

Write-Host 'Generating apidoc'
npm run apidoc


Write-Host 'Running infra'
Set-Location infraestructure-py
. .\deploy.ps1
Set-Location ..

Copy-Item -Path .\api.json .\function
Copy-Item -Path .\backend.json .\function
Copy-Item -Path .\webapp.json .\function

Copy-Item -Path .\api.json .\webapp
Copy-Item -Path .\webapp.json .\webapp
# run test here

Write-Host 'Running webapp'
Set-Location webapp
. .\deploy.ps1
Set-Location ..

