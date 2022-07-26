function formatJsText() {
    echo $1 | sed 's/\\/\\\\/g' | sed "s/'/\\\\'/g"
}

IFS=$'\n'
echo "window.env = {"
counter=0
envName=$2
if [ -z $envName ]
then
    envName="APP_ENVIRONMENT"
fi
for line in $(printenv)
do
    varName=${line/=*}
    if [[ $varName == $1* ]] || [ $varName == $envName ]
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
