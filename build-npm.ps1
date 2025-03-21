<#
.SYNOPSIS
Compiles wj-config.

.DESCRIPTION
Automates all of the necessary steps to compile and optionally publish the wj-config package:

1. Increments the package version according to what is specified.
2. Compiles the TypeScript source code and outputs it to .\out.
3. Copies the wj-config.d.ts definition file.
4. Copies the package.json file.
5. Prepares the npmjs.org readme file by joining PublishNote.md and README.md.
6. If the Publish switch is specified, performs actual publishing to the NPM public registry.

NOTE:  If the Publish switch is not specified, then npm publish is run in dry-mode, just to show the potential result of publishing.

Use the Verbose switch to turn on all messages.

.PARAMETER VerUpgrade
Specify a version change.  See the documentation for the command 'npm version' for detailed information.

.PARAMETER PreId
Specify the pre-release ID to use.  Common examples would be 'alpha', 'beta' or 'rc'.  See the documentation for the command 'npm version' for detailed information.

.PARAMETER Publish
.  Useful to examine the end results.  Note that 'npm publish' will be run in dry mode.

#>
[CmdletBinding(SupportsShouldProcess = $true)]
param (
    [Parameter(Mandatory = $false)]
    [ValidateSet("major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease")]
    [string] $VerUpgrade,
    [Parameter(Mandatory = $false)]
    [string] $PreId,
    [Parameter(Mandatory = $false)]
    [switch] $Publish
)
begin {
    $ErrorActionPreference = 'Stop'
    [string] $path = Resolve-Path .\
    if ($VerUpgrade -ne '') {
        if ($PSCmdlet.ShouldProcess($path, "Package version increment: $VerUpgrade")) {
            if ($PreId -ne '') {
                npm version $VerUpgrade --preid $PreId --no-git-tag-version
            }
            else {
                npm version $VerUpgrade --no-git-tag-version
            }
        }
    }
    else {
        Write-Verbose "Version upgrade was not specified.  The package's version will not be modified."
    }
    [string] $pkgVersion = Get-Content -Path .\package.json | Where-Object { $_ -match '^\s*"version":' }
    if ($pkgVersion -match '"version":\s*"\d+\.\d+\.\d+-(.+)"') {
        $tag = $matches[1]
    } else {
        $tag = $null
    }
    if (Test-Path .\out) {
        Remove-Item -Path .\out -Recurse
    }
    if ($PSCmdlet.ShouldProcess($path, "TypeScript compilation")) {
        npx tsc
    }
    Copy-Item .\src\wj-config.d.ts .\out
    if (!$Publish) {
        Write-Output "Running npm publish in dry run mode."
        if ($null -ne $tag) {
            npm publish --tag $tag --dry-run
        }
        else {
            npm publish --dry-run
        }
    }
    elseif ($PSCmdlet.ShouldProcess($path, "Publish NPM package")) {
        if ($null -ne $tag) {
            npm publish --tag $tag
        }
        else {
            npm publish
        }
    }
    elseif ($WhatIfPreference) {
        Write-Verbose "NOTE: Running npm publish in dry run mode using sample data for illustration purposes only."
        if (-not (Test-Path .\out)) {
            New-Item -Path .\out -ItemType Directory -WhatIf:$false
        }
        if (-not (Test-Path .\out\test.js)) {
            New-Item -Path .\out\test.js -ItemType File -WhatIf:$false
        }
        if ($null -ne $tag) {
            npm publish --tag $tag --dry-run
        }
        else {
            npm publish --dry-run
        }
    }
}
