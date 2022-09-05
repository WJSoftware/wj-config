<#
.SYNOPSIS
Publishes wj-config to the public NPM registry.

.DESCRIPTION
Automates all of the necessary steps to compile and publish the wj-config package:

1. Increments the package version according to what is specified.
2. Compiles the TypeScript source code and outputs it to .\out.
3. Copies the wj-config.d.ts definition file.
4. Copies the package.json file.
5. Prepares the npmjs.org readme file by joining PublishNote.md and README.md.
6. Performs actual publishing to the NPM public registry.

.PARAMETER VerUpgrade
Specify a version change.  See the documentation for the command 'npm version' for detailed information.

.PARAMETER PreId
Specify the pre-release ID to use.  Common examples would be 'alpha', 'beta' or 'rc'.  See the documentation for the command 'npm version' for detailed information.

.PARAMETER NoPublish
Runs all necessary logic to publish the wj-config NPM package except actually publishing it.  Useful to examine the end results.  Note that 'npm publish' will be run in dry mode.

#>
[CmdletBinding(SupportsShouldProcess = $true)]
param (
    [Parameter(Mandatory = $false)]
    [ValidateSet("major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease")]
    [string] $VerUpgrade,
    [Parameter(Mandatory = $false)]
    [string] $PreId,
    [Parameter(Mandatory = $false)]
    [switch] $NoPublish
)
begin {
    $InformationPreference = 'Continue'
    [string] $path = Resolve-Path .\src\package.json
    if ($VerUpgrade -ne '') {
        if ($PSCmdlet.ShouldProcess($path, "Package version increment: $VerUpgrade")) {
            Set-Location .\src
            npm version $VerUpgrade --preid $PreId
            Set-Location ..\
        }
    }
    else {
        Write-Information "Version upgrade was not specified.  The package's version will not be modified."
    }
    $path = Resolve-Path .\
    Remove-Item -Path .\out -Recurse
    if ($PSCmdlet.ShouldProcess($path, "TypeScript compilation")) {
        npx tsc
    }
    Copy-Item .\src\wj-config.d.ts .\out
    Copy-Item .\src\package.json .\out
    Copy-Item .\PublishNote.md .\out\README.md -Force
    Get-Content .\README.md | Add-Content .\out\README.md -Encoding UTF8
    $path = Resolve-Path .\
    if ($NoPublish) {
        Write-Information "Publishing was turned off.  No publishing will take place, but will run npm publish in dry run mode."
        npm publish .\out\ --dry-run
    }
    elseif ($PSCmdlet.ShouldProcess($path, "Publish NPM package")) {
        npm publish .\out\
    }
    elseif ($WhatIfPreference) {
        Write-Information "NOTE: Running npm publish in dry run mode using sample data for illustration purposes only."
        if (-not (Test-Path .\out)) {
            New-Item -Path .\out -ItemType Directory -WhatIf:$false
        }
        if (-not (Test-Path .\out\test.js)) {
            New-Item -Path .\out\test.js -ItemType File -WhatIf:$false
        }
        Copy-Item .\src\package.json .\out -WhatIf:$false
        npm publish .\out\ --dry-run
    }
}
