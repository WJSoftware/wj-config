Set-Location .\src
npx tsc
Copy-Item ..\PublishNote.md .\
Get-Content ..\README.md | Add-Content .\README.md -Encoding UTF8
Set-Location .\out
npm publish
