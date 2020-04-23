# A script to allow pxt setup of a certain version of a target

TARGET=$1
VERSION=$2
node_modules/pxt/pxt target $TARGET@$VERSION
echo "{\"targetdir\": \"pxt-$TARGET\"}" > node_modules/pxtcli.json
node_modules/pxt/pxt install
