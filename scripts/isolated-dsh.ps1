param(
  [Parameter(Mandatory = $true)]
  [string]$DshHome,

  [string]$LogPath,

  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$DshArgs
)

$ErrorActionPreference = 'Continue'
$PSNativeCommandUseErrorActionPreference = $false
$env:DSH_HOME = [System.IO.Path]::GetFullPath($DshHome)
if ($LogPath) {
  $resolvedLog = [System.IO.Path]::GetFullPath($LogPath)
  & dsh @DshArgs 2>&1 | Tee-Object -FilePath $resolvedLog
  $exitCode = $LASTEXITCODE
} else {
  & dsh @DshArgs
  $exitCode = $LASTEXITCODE
}
exit $exitCode
