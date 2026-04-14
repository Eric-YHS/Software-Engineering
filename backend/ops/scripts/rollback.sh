#!/bin/bash

# 回滚脚本
# 使用前一个版本的镜像

BACKUP_TAG=${1:-previous}

docker-compose stop
docker tag backend:latest backend:backup
docker pull backend:${BACKUP_TAG}
docker tag backend:${BACKUP_TAG} backend:latest
docker-compose start

echo "Rolled back to version: ${BACKUP_TAG}"
