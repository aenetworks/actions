#!/usr/bin/env bash

echo Replacing tag \""${1}"\" with \""${2}"\";
find . -name action.yml -exec sed -i '' "s/actions:${1}/actions:${2}/g" {} +;
