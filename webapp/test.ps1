Start-Job -Name webserver -ScriptBlock { http-server.cmd }

# open cypress hui tool
# npx cypress open

# run test on cli
npx cypress run

Stop-Job -Name webserver