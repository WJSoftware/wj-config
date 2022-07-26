
[CmdletBinding()]
Param(
    [Parameter(Mandatory, Position = 0)]
    [string] $Prefix,
    [Parameter(Mandatory = $false, Position = 1)]
    [string] $EnvName
)

function Format-JsText {
    Param(
        [Parameter(Mandatory, Position = 0)]
        [string] $Text
    )
    $Text.Replace("\", "\\").Replace("'", "\'")
}

# Version: 1.0.0
Write-Host "window.env = {"
[int] $counter = 0
if ($EnvName -eq "") {
    $EnvName = "APP_ENVIRONMENT"
}
Get-ChildItem env: | Where-Object { $_.Key.startsWith($Prefix) -Or $_.Key -eq $EnvName } | ForEach-Object {
    if ($counter++ -ne 0) {
        Write-Host ","
    }
    Write-Host "    $($_.Key): '$(Format-JsText $_.Value)'" -NoNewline
}
Write-Host
Write-Host "};"
