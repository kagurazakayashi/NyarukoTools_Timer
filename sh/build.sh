#!/bin/bash
rm -rf ../release/*
electron-packager ../ --overwrite --platform=darwin --arch=x64 --out=../release --icon=../assets/app.icns
electron-packager ../ --overwrite --platform=win32 --arch=ia32 --out=../release --icon=../assets/app.ico
electron-packager ../ --overwrite --platform=win32 --arch=x64 --out=../release --icon=../assets/app.ico
electron-packager ../ --overwrite --platform=linux --arch=x64 --out=../release --icon=../assets/app.png