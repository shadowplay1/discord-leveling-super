#!/bin/bash

clean_up() {
    rm -rf "/tmp/src"
    rm "/tmp/${package_version}.json"
}

echo "[1/3] - Generating documentation..."
echo

if ! source ./scripts/docgen.sh; then
    echo "An error has occured."
    exit 1
fi


# add missing generics in classes & in classes with 2+ type arguments
sed -i 's/toReplace/replaceWith/g' "./docs/generated/${package_version}.json"
# [FILL IN]

cp "./docs/generated/${package_version}.json" "./docs/generated/master.json"
cp "./docs/generated/${package_version}.json" "/tmp/${package_version}.json"
cp "./docs/generated/master.json" "/tmp/master.json"

cp -r "./src" "/tmp/src"


echo
echo "[2/3] - Publishing documentation..."
echo

git fetch -p origin > /dev/null 2>&1

is_docs_branch_existing=$(git rev-parse --verify docs)

if [[ -z $is_docs_branch_existing ]]; then
    git checkout --orphan docs > /dev/null 2>&1
else
    git checkout docs > /dev/null 2>&1
fi


git reset --hard origin/docs > /dev/null 2>&1
git rm --cached . -r

cp "/tmp/${package_version}.json" "./${package_version}.json"
cp "./${package_version}.json" "./master.json"

git add "${package_version}.json"
git commit -m "docs: documentation update for v${package_version}"
git push -u origin docs

git reset --hard origin/docs > /dev/null 2>&1

echo
echo "[3/3] - Pushing sources..."
echo


is_version_branch_existing="$(git rev-parse --verify "$package_version")"

if [[ -z $is_version_branch_existing ]]; then
    git checkout --orphan "$package_version" > /dev/null 2>&1
else
    git checkout "$package_version" > /dev/null 2>&1
fi

git reset --hard "origin/$package_version" > /dev/null 2>&1
cp -r "/tmp/src" "./"

git add .

git commit -m "docs: sources update for v${package_version}"
git push -u origin "$package_version"

git reset --hard "origin/$package_version" > /dev/null 2>&1


is_master_branch_existing="$(git rev-parse --verify "master")"

if [[ -z $is_master_branch_existing ]]; then
    git checkout --orphan "master" > /dev/null 2>&1
else
    git checkout "master" > /dev/null 2>&1
fi

git reset --hard "origin/master" > /dev/null 2>&1
cp -r "/tmp/src" "./"

git add .
git commit -m "docs: sources update for v${package_version}"
git push -u origin "master"

git reset --hard "origin/master" > /dev/null 2>&1


clean_up

git checkout main
git reset --hard origin/main

echo
echo "Done!"
