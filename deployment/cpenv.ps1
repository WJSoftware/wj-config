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

# Version: 1.0.1
Write-Output "window.env = {"
if ($EnvName -eq "") {
    $EnvName = "APP_ENVIRONMENT"
}
[string] $prevLine = ""
Get-ChildItem env: | Where-Object { $_.Key.startsWith($Prefix) -Or $_.Key -eq $EnvName } | ForEach-Object {
    if ($prevLine -ne "") {
        $prevLine += ","
        Write-Output $prevLine
    }
    $prevLine = "    $($_.Key): '$(Format-JsText $_.Value)'"
}
Write-Output $prevLine
Write-Output "};"
