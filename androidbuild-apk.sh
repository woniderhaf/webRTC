#!/usr/bin/env bash

mkdir android/app/src/main/assets/

npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

cd android

rm -rf ./app/src/main/res/raw
rm -rf ./app/src/main/res/drawable-*

./gradlew clean
echo 'clean done!'

./gradlew assembleRelease --warning-mode=all

open './app/build/outputs/apk/release'

echo 'build done!'