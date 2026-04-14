#!/bin/bash

# 重启脚本
docker-compose restart

# 查看日志
docker-compose logs -f --tail=50
