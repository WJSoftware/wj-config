Get-Content .\PublishNote.md > .\src\README.md
Get-Content .\README.md >> .\src\README.md
Set-Location .\src
npm publish
