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
Publishes the package.

.PARAMETER NpmTag
Specifies the tag to use when publishing the package.  This is useful for pre-release versions.  See the documentation for the command 'npm publish' for detailed information.

It cannot be used when the package version contains a pre-release tag, and is only used when publishing.
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param (
    [Parameter(Mandatory = $false)]
    [ValidateSet("major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease")]
    [string] $VerUpgrade,
    [Parameter(Mandatory = $false)]
    [string] $PreId,
    [Parameter(Mandatory = $false)]
    [switch] $Publish,
    [Parameter(Mandatory = $false)]
    [string] $NpmTag
)
begin {
    $ErrorActionPreference = 'Stop'
    [string] $path = Resolve-Path .\
    if ($VerUpgrade -ne '') {
        if ($PSCmdlet.ShouldProcess($path, "Package version increment: $VerUpgrade")) {
            if ($PreId -ne '') {
                npm version $VerUpgrade --preid $PreId
            }
            else {
                npm version $VerUpgrade
            }
        }
    }
    else {
        Write-Verbose "Version upgrade was not specified.  The package's version will not be modified."
    }
    if (Test-Path .\dist) {
        Remove-Item -Path .\dist -Recurse -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path .\out) {
        Remove-Item -Path .\out -Recurse
    }
    if ($PSCmdlet.ShouldProcess($path, "Bundle package")) {
        npx rollup -c
    }
    if ($PSCmdlet.ShouldProcess($path, "TypeScript compilation")) {
        npx tsc
    }
    Copy-Item .\src\wj-config.d.ts .\out
    [string] $publishTag = $NpmTag -eq "" ? "latest" : $NpmTag
    if (!$Publish) {
        Write-Output "Running npm publish in dry run mode using tag '$publishTag'."
        npm publish --tag $publishTag --dry-run
    }
    elseif ($PSCmdlet.ShouldProcess($path, "Publish NPM package")) {
        npm publish --tag $publishTag
    }
    elseif ($WhatIfPreference) {
        Write-Verbose "NOTE: Running npm publish in dry run mode using tag '$publishTag' and sample data for illustration purposes only."
        if (-not (Test-Path .\out)) {
            New-Item -Path .\out -ItemType Directory -WhatIf:$false
        }
        if (-not (Test-Path .\out\test.js)) {
            New-Item -Path .\out\test.js -ItemType File -WhatIf:$false
        }
        npm publish --tag $publishTag --dry-run
    }
}
