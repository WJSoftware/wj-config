<#
.SYNOPSIS
Builds wj-config.

.DESCRIPTION
Automates the build process for the wj-config package:

1. Cleans up the previous build artifacts.
2. Bundles the package using Rollup.
2. Compiles the TypeScript source code and outputs it to .\out.
3. Copies the wj-config.d.ts definition file.
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param (
)
begin {
    function Write-Host-Highlight {
        param (
            [Parameter(Mandatory = $true)]
            [string]$Message,
            [ConsoleColor]$ForegroundColor = 'Yellow',
            [ConsoleColor]$BackgroundColor = 'DarkBlue'
        )
        $origFg = $Host.UI.RawUI.ForegroundColor
        $origBg = $Host.UI.RawUI.BackgroundColor
        $Host.UI.RawUI.ForegroundColor = $ForegroundColor
        $Host.UI.RawUI.BackgroundColor = $BackgroundColor
        Write-Host $Message
        $Host.UI.RawUI.ForegroundColor = $origFg
        $Host.UI.RawUI.BackgroundColor = $origBg
    }

    function Write-Warning-Highlight {
        param (
            [Parameter(Mandatory = $true)]
            [string]$Message,
            [ConsoleColor]$ForegroundColor = 'Black',
            [ConsoleColor]$BackgroundColor = 'DarkYellow'  # DarkYellow is visible on both light and dark backgrounds
        )
        $origFg = $Host.UI.RawUI.ForegroundColor
        $origBg = $Host.UI.RawUI.BackgroundColor
        $Host.UI.RawUI.ForegroundColor = $ForegroundColor
        $Host.UI.RawUI.BackgroundColor = $BackgroundColor
        Write-Host $Message
        $Host.UI.RawUI.ForegroundColor = $origFg
        $Host.UI.RawUI.BackgroundColor = $origBg
    }

    function Write-Error-Highlight {
        param (
            [Parameter(Mandatory = $true)]
            [string]$Message,
            [ConsoleColor]$ForegroundColor = 'White',
            [ConsoleColor]$BackgroundColor = 'DarkRed'  # DarkRed is visible on both light and dark backgrounds
        )
        $origFg = $Host.UI.RawUI.ForegroundColor
        $origBg = $Host.UI.RawUI.BackgroundColor
        $Host.UI.RawUI.ForegroundColor = $ForegroundColor
        $Host.UI.RawUI.BackgroundColor = $BackgroundColor
        Write-Host $Message
        $Host.UI.RawUI.ForegroundColor = $origFg
        $Host.UI.RawUI.BackgroundColor = $origBg
    }

    $ErrorActionPreference = 'Stop'
    [string] $path = Resolve-Path .\
    if (Test-Path .\dist) {
        Write-Verbose "Removing old dist directory..."
        Remove-Item -Path .\dist -Recurse -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path .\out) {
        Write-Verbose "Removing old out directory..."
        Remove-Item -Path .\out -Recurse
    }
    if ($PSCmdlet.ShouldProcess($path, "Bundle package")) {
        Write-Verbose "Bundling package using rollup..."
        npx rollup -c
    }
    if ($PSCmdlet.ShouldProcess($path, "TypeScript compilation")) {
        Write-Verbose "Transpiling TypeScript files..."
        npx tsc
    }
    Write-Verbose "Copying .d.ts files..."
    Copy-Item .\src\wj-config.d.ts .\out
    Write-Host-Highlight "Building process completed."
}
