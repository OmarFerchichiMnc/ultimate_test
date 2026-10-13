#!/usr/bin/env bash
set -euo pipefail

export AWS_PROFILE="${AWS_PROFILE:-default}"
REGION="${AWS_REGION:-eu-north-1}"
BASTION_TAG="${SSM_BASTION_TAG:-adad-ec2-bastion}"
REMOTE_HOST="${SSM_REMOTE_HOST:-db.dev.adad.internal}"
REMOTE_PORT="${SSM_REMOTE_PORT:-5432}"
LOCAL_PORT="${SSM_LOCAL_PORT:-5554}"

bastion_id=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=${BASTION_TAG}" \
  --query "Reservations[].Instances[?State.Name=='running'].InstanceId" \
  --output text \
  --region "${REGION}")

if [[ -z "${bastion_id}" || "${bastion_id}" == "None" ]]; then
  echo "No running bastion instance found for tag ${BASTION_TAG}" >&2
  exit 1
fi

echo "Forwarding localhost:${LOCAL_PORT} -> ${REMOTE_HOST}:${REMOTE_PORT} via ${bastion_id}"

aws ssm start-session \
  --target "${bastion_id}" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters "{\"portNumber\":[\"${REMOTE_PORT}\"],\"localPortNumber\":[\"${LOCAL_PORT}\"],\"host\":[\"${REMOTE_HOST}\"]}" \
  --region "${REGION}"
