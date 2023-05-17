#!/bin/bash
# Usage: ./deploy.sh $profile

source ../deploy/common.sh

profile=${1:-build}

echo "Deploying Skaffold profile for uitest '${profile}'"

echo_step "LOGIN & CONTEXT"
../deploy/login.sh

echo "Update job template"
cat k8s/base/job_template.yaml | sed "s/{{TARGET}}/$TARGET/g" >> k8s/base/job.yaml  

log_file=test_deoploy.log
[[ -f $log_file ]] && rm $log_file
{
  echo_step "RUN"
  create_kaniko_namespace
  sleep 2
  #skaffold delete -p $profile
  skaffold run -p $profile
  delete_kaniko_namespace
} 2>&1 | tee $log_file
sleep 5

echo "Waiting for job to complete"
result=$(kubectl wait --for=condition=complete --timeout=180s job/testjob -n uitest)

echo "Check detailed results in https://uitest.52.247.203.128.nip.io/${TARGET}/log.html"
if [[ $result == *"condition met"* ]]; then 
	echo test complete
else	
    exit 1
fi 

#echo "Check logs"
#if [[ -s $log_file ]]; then
#  [[ $(grep "failed to build" "${log_file}" -c) -gt 0 ]] && error "Build failed."
#  [[ $(grep "couldn't find profile" "${log_file}" -c) -gt 0 ]] && error "Invalid Skaffold profile."
#else
#  error "${log_file} not found."
#fi
