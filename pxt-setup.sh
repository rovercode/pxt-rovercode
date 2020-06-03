# Use this instead of `pxt target` to keep it from updating our pxt-microbit version

TARGET=$1
echo "{\"targetdir\": \"pxt-$TARGET\"}" > node_modules/pxtcli.json
node_modules/pxt/pxt install
