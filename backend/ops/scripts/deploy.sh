#!/bin/bash

# 环境变量
PROJECT_NAME="backend"
PROFILE="prod"
JAR_FILE="target/${PROJECT_NAME}.jar"

# 停止旧容器
docker-compose down

# 重新构建并启动
docker-compose build --no-cache
docker-compose up -d

# 查看日志
docker-compose logs -f --tail=100
