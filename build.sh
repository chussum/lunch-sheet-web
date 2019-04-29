#!/bin/bash

NEW_DIR="dist-current"

tsc --project ./tsconfig.json

cp src/config/google.json dist/config/google.json
cp -rf src/static dist/static
cp -rf src/views dist/views

if [ -d $NEW_DIR ]
then
  OLD_DATE=`date -r $NEW_DIR +%Y%m%d%H%M%S`
  OLD_DIR="dist-$OLD_DATE"
  if [ ! -d $OLD_DIR ]
  then 
    mkdir $OLD_DIR
  else
    rm -rf $OLD_DIR
  fi
  mv $NEW_DIR $OLD_DIR
fi

mv dist $NEW_DIR

