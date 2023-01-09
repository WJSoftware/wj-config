function formatJsText() {
    echo $1 | sed 's/\\/\\\\/g' | sed "s/'/\\\\'/g"
}

# Version: 2.0.0
IFS=$'\n'
counter=0
prefix=$1
envName=$2
envTraits=$3
if [ -z $prefix ]
then
    prefix="OPT_"
fi
if [ -z $envName ]
then
    envName="APP_ENVIRONMENT"
fi
echo "window.env = {"
for line in $(printenv)
do
    varName=${line/=*}
    if [[ $varName == $prefix* ]] || [ $varName == $envName ] || [[ $envTraits == $varName ]]
    then
        if [ $counter -ne 0 ]
        then
            echo ","
        fi
        let counter++
        echo -n "    $varName: '$(formatJsText "${line/*=}")'"
    fi
done
echo -e "\n};"
