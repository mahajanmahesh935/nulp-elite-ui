#!/bin/bash
rm -rf prod-build
mkdir prod-build
mkdir prod-build/modules
find packages \( ! -path packages/common-lib -o ! -path packages/teacher-app \) -type d  -maxdepth 1 -mindepth 1 -exec bash -c '
for f  do
    # echo $f
    if [ $f != "packages/common-lib" ] &&  [ $f != "packages/teacher-app" ] && [ $f != "packages/student-app" ]; then
        echo "Processing ${f//packages\//}"
        cp -rf "$f/build" "prod-build/modules/${f//packages\//}"
    fi
done 
' sh {} +
cp -r  packages/nulp_elite/build/* prod-build/
# cp -r  packages/players/* prod-build/
find  prod-build -name  'modules.json' | xargs sed -i 's|http://localhost:[0-9]*||g'
cd prod-build && tar -cf ../shiksha-ui.tar . && cd ../
if [ ! -d "../dist" ]; then
    mkdir ../dist
fi
cp -r prod-build/* ../dist/
find ../dist -type f -name 'index.html' -exec bash -c 'mv "$1" "${1%.html}.ejs"' _ {} \;