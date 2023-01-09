<#
.DESCRIPTION
PowerShell script used to generate a simple JavaScript assgnment operation:  Assigns qualifying environment variables 
as properties to the window.env property.

.PARAMETER Prefix
OPTIONAL.  The prefix environment variables must start with in order to qualify and be part of window.env.  If no 
value is provided, wj-config's default OPT_ prefix is assumed.

.PARAMETER EnvName
OPTIONAL.  The environment variable's name that holds the application's environment name.  Make sure the name is not 
matched by the prefix.

.PARAMETER EnvTraits
OPTIONAL.  The environment variable's name that holds the defined environment traits.  Make sure the name is not  
matched by the prefix.
#>
[CmdletBinding()]
Param(
    [Parameter(Mandatory = $false, Position = 0)]
    [string] $Prefix,
    [Parameter(Mandatory = $false, Position = 1)]
    [string] $EnvName,
    [Parameter(Mandatory = $false, Position = 2)]
    [string] $EnvTraits
)

function Format-JsText {
    Param(
        [Parameter(Mandatory, Position = 0)]
        [string] $Text
    )
    "'" + ($Text.Replace("\", "\\").Replace("'", "\'")) + "'"
}

# Version: 2.0.0
Write-Output "window.env = {"
if ($Prefix -eq "") {
    $Prefix = "OPT_"
}
[string] $prevLine = ""
Get-ChildItem env: | Where-Object { $_.Key.startsWith($Prefix) -Or $_.Key -eq $EnvName -Or $_.Key -eq $EnvTraits } | ForEach-Object {
    if ($prevLine -ne "") {
        $prevLine += ","
        Write-Output $prevLine
    }
    $prevLine = "    $($_.Key): $(Format-JsText $_.Value)"
}
if ($prevLine -ne "") {
    Write-Output $prevLine
}
Write-Output "};"
