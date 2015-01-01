#!/usr/bin/env sh
mkdir travis-output-repo
mv * ./travis-output-repo
mv ./travis-output-repo/_site/* ./
rm -R ./travis-output-repo
