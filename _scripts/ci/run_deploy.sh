#!/usr/bin/env sh
BRANCH=${GH_BRANCH-gh-pages}
USERNAME=${GH_USER-Travis-CI}
EMAIL=${GH_EMAIL-travis@travis-ci.org}

mkdir travis-output-repo
git clone "https://${GH_TOKEN}@${GH_REF}" travis-output-repo
cd travis-output-repo
git config user.name "${USERNAME}"
git config user.email "${EMAIL}"
git checkout --orphan ${BRANCH}
git rm -rf .
cp -R ../_site/* ./
git add -A
git commit -m "Deployed to Github Pages"
git push --quiet "https://${GH_TOKEN}@${GH_REF}" > /dev/null 2>&1