aws s3 sync \
    --metadata TravisJobNumber=${TRAVIS_JOB_NUMBER} \
    --acl public-read \
    --content-disposition attachment \
    built/ s3://rovercode-pxt/$1/
