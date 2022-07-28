Get-Content .\PublishNote.md | Set-Content .\src\README.md -Encoding UTF8
Get-Content .\README.md | Add-Content .\src\README.md -Encoding UTF8
Set-Location .\src
npm publish
