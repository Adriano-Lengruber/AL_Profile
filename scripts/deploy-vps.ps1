param(
  [string]$HostName = "148.230.75.59",
  [string]$UserName = "adriano",
  [string]$AppDir = "~/AL_Profile",
  [string]$PublicDomain = "https://adriano-lengruber.com"
)

$remoteCommand = @"
set -Eeuo pipefail
mkdir -p $AppDir
cd $AppDir
if [ ! -d .git ]; then
  git clone https://github.com/Adriano-Lengruber/AL_Profile.git .
fi
APP_DIR=$AppDir PUBLIC_DOMAIN=$PublicDomain bash scripts/vps-safe-deploy.sh
"@

ssh "$UserName@$HostName" $remoteCommand
