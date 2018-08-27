#!/bin/bash

if [ ! -n "$1" ] ;then
    echo "No input file"
    exit 1
fi

cat $1.* | sed 's/^[[:space:]]*//'
