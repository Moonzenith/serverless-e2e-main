
# copy api.json file
# Copy-Item -Path ..\api.json .
# Copy-Item -Path ..\backend.json .
# Copy-Item -Path ..\webapp.json .

# run individual folders

Get-ChildItem -Path . |

ForEach-Object {
    # Write-Output $_.Name $_.Mode
    if ($_.Mode -eq '-a---') { return }


    $functionName = Write-Output $_.Name
    Write-Output $functionName
    Set-Location $functionName
    . .\deploy.ps1 
    Set-Location ..

}