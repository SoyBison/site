#!/usr/bin/env bash
echo "Introduction:"
echo ">>> nslookup foxbusinessp.factsetdigitalsolutions.com"
nslookup foxbusinessp.factsetdigitalsolutions.com
echo "Ownership:"
echo ">>> nslookup nytimes.com"
nslookup nytimes.com
if [ -z "$(ls -f ./*.json)" ]; then
    echo "Error: Run make to do all the data processing." 1>&2 
fi

