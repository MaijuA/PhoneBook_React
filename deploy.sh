#!/bin/sh
npm run build
rm -rf ../puhelinluettelo_backend/build
cp -r build ../puhelinluettelo_backend
chmod u+x deploy.sh