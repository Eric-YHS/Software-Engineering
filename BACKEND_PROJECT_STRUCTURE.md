# 项目结构文档

## 概述

本文档定义 Spring Boot 项目的标准目录结构，用于团队成员统一开发规范。

---

## 一、源码目录结构

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── project/
│   │           └── {项目名}/
│   │               ├── controller/          # 控制层
│   │               ├── service/             # 业务层
│   │               │   └── impl/            # 业务层实现
│   │               ├── mapper/              # 数据访问层 (DAO)
│   │               ├── entity/              # 实体类 (Domain)
│   │               ├── dto/                 # 数据传输对象
│   │               │   ├── request/         # 请求 DTO
│   │               │   └── response/        # 响应 DTO
│   │               ├── vo/                  # 视图对象 (可选)
│   │               ├── config/              # 配置类
│   │               ├── interceptor/         # 拦截器
│   │               ├── filter/              # 过滤器
│   │               ├── exception/          # 异常处理
│   │               │   ├── handler/        # 全局异常处理器
│   │               │   └── business/       # 业务异常类
│   │               ├── common/              # 公共组件
│   │               │   ├── constants/       # 常量定义
│   │               │   ├── enums/           # 枚举类
│   │               │   ├── utils/           # 工具类
│   │               │   └── result/          # 统一响应结构
│   │               ├── security/            # 安全认证模块
│   │               └── {项目名}Application.java  # 启动类
│   │
│   └── resources/
│       ├── mapper/                    # MyBatis XML 映射文件
│       ├── static/                    # 静态资源 (CSS, JS, 图片)
│       ├── templates/                 # 模板引擎文件 (Thymeleaf, FreeMarker)
│       ├── application.yml            # 主配置文件
│       ├── application-dev.yml        # 开发环境配置
│       ├── application-prod.yml       # 生产环境配置
│       ├── application-test.yml       # 测试环境配置
│       ├── logback-spring.xml         # 日志配置
│       └── mybatis-config.xml         # MyBatis 配置文件 (可选)
│
└── test/
    ├── java/
    │   └── com/
    │       └── project/
    │           └── {项目名}/
    │               ├── controller/      # 控制器测试
    │               ├── service/        # 业务层测试
    │               └── mapper/         # 数据层测试
    └── resources/
        ├── application-test.yml        # 测试环境配置
        ├── data.sql                    # 测试数据 SQL
        └── schema.sql                  # 表结构 SQL
```

---

## 二、目录说明

### 2.1 Controller 层 (controller/)

| 目录 | 说明 |
|------|------|
| `controller/` | 负责接收请求、调用 Service、返回响应 |
| `request/` | 请求参数校验 |
| `response/` | 响应数据封装 |

**命名规范**: `{业务名}Controller.java`

**示例**:
```java
@RestController
@RequestMapping("/api/user")
public class UserController {
    // 处理 HTTP 请求
}
```

### 2.2 Service 层 (service/)

| 目录 | 说明 |
|------|------|
| `service/` | 接口定义 |
| `service/impl/` | 接口实现 |

**命名规范**: `{业务名}Service.java` / `{业务名}ServiceImpl.java`

### 2.3 Mapper 层 (mapper/)

| 目录 | 说明 |
|------|------|
| `mapper/` | 数据访问接口 (MyBatis Mapper) |

**命名规范**: `{业务名}Mapper.java`

### 2.4 Entity 层 (entity/)

| 目录 | 说明 |
|------|------|
| `entity/` | 数据库实体类，与表一一对应 |

**命名规范**: 与数据库表名对应，如 `User` -> `User.java`

### 2.5 DTO 层 (dto/)

| 目录 | 说明 |
|------|------|
| `dto/request/` | 请求数据传输对象 |
| `dto/response/` | 响应数据传输对象 |

**使用场景**:
- `request/`: 接收前端参数，可做校验和转换
- `response/`: 返回给前端的数据结构

### 2.6 Config 层 (config/)

| 目录 | 说明 |
|------|------|
| `config/` | Spring 配置类 |

**常见配置类**:
- `WebMvcConfig.java` - Web MVC 配置
- `MybatisConfig.java` - MyBatis 配置
- `RedisConfig.java` - Redis 配置
- `SecurityConfig.java` - 安全配置
- `CorsConfig.java` - 跨域配置

### 2.7 Interceptor 层 (interceptor/)

| 目录 |说明 |
|------|------|
| `interceptor/` | 请求拦截器 |

**示例**: 登录拦截器、日志拦截器、权限拦截器

### 2.8 Filter 层 (filter/)

| 目录 | 说明 |
|------|------|
| `filter/` | Servlet 过滤器 |

**示例**: XSS 过滤、字符编码过滤

### 2.9 Exception 层 (exception/)

| 目录 | 说明 |
|------|------|
| `exception/handler/` | 全局异常处理器 |
| `exception/business/` | 业务异常类 |

**示例**: 自定义异常 `BusinessException.java`

### 2.10 Common 层 (common/)

| 目录 | 说明 |
|------|------|
| `common/constants/` | 常量定义 |
| `common/enums/` | 枚举类 |
| `common/utils/` | 工具类 |
| `common/result/` | 统一响应结构 |

---

## 三、配置文件目录结构

```
config/
├── sql/                          # SQL 脚本目录
│   ├── init/                     # 初始化脚本
│   │   ├── schema.sql            # 表结构
│   │   └── data.sql              # 基础数据
│   ├── migration/                # 数据库迁移脚本
│   └── backup/                   # 备份脚本
└── application.yml               # 主配置文件模板
```

---

## 四、Docker 相关配置

### 4.1 必要文件

```
docker/
├── Dockerfile                    # 应用镜像构建文件
├── docker-compose.yml            # 容器编排文件
├── .dockerignore                 # Docker 忽略文件
└── nginx/
    ├── nginx.conf                # Nginx 配置文件
    └──/conf.d/
        └── default.conf          # 站点配置
```

### 4.2 Dockerfile 说明

**基础模板**:

```dockerfile
# 构建阶段
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 运行阶段
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**构建命令**:
```bash
# 构建镜像
docker build -t {项目名}:latest .

# 运行容器
docker run -d -p 8080:8080 --name {容器名} {项目名}:latest
```

### 4.3 docker-compose.yml 说明

**基础模板**:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/dbname
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=password
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: dbname
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

**启动命令**:
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

---

## 五、CI/CD 配置

### 5.1 必要文件

```
.github/
└── workflows/
    ├── ci.yml                     # 持续集成 workflow
    └── cd.yml                     # 持续部署 workflow

.gitlab-ci.yml                     # GitLab CI 配置 (可选)

Jenkinsfile                        # Jenkins pipeline (可选)

ops/
├── helm/                          # Helm charts (K8s部署)
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
└── scripts/
    ├── deploy.sh                  # 部署脚本
    ├── restart.sh                 # 重启脚本
    └── rollback.sh                # 回滚脚本
```

### 5.2 GitHub Actions CI 模板

**.github/workflows/ci.yml**:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Maven packages
        uses: actions/cache@v4
        with:
          path: ~/.m2/repository
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}

      - name: Build with Maven
        run: mvn clean package -DskipTests

      - name: Run tests
        run: mvn test

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: package
          path: target/*.jar
```

### 5.3 GitHub Actions CD 模板

**.github/workflows/cd.yml**:

```yaml
name: CD

on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ workflow_run.conclusion == 'success' }}

    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: package

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app/{项目名}
            docker-compose pull
            docker-compose up -d
```

### 5.4 部署脚本示例

**ops/scripts/deploy.sh**:

```bash
#!/bin/bash

# 环境变量
PROJECT_NAME="your-project"
PROFILE="prod"
JAR_FILE="target/${PROJECT_NAME}.jar"

# 停止旧容器
docker-compose down

# 重新构建并启动
docker-compose build --no-cache
docker-compose up -d

# 查看日志
docker-compose logs -f --tail=100
```

**使用说明**:
```bash
# 添加执行权限
chmod +x ops/scripts/deploy.sh

# 执行部署
./ops/scripts/deploy.sh
```

---

## 六、根目录文件

```
项目根目录/
├── .gitignore                     # Git 忽略配置
├── .editorconfig                   # 编辑器配置
├── pom.xml                         # Maven 配置文件
├── README.md                       # 项目说明
├── LICENSE                         # 许可证
└── PROJECT_STRUCTURE.md            # 本文档
```

---

## 七、命名规范总结

| 层级 | 规范 | 示例 |
|------|------|------|
| Controller | `{业务名}Controller` | `UserController` |
| Service | `{业务名}Service` | `UserService` |
| Service Impl | `{业务名}ServiceImpl` | `UserServiceImpl` |
| Mapper | `{业务名}Mapper` | `UserMapper` |
| Entity | 表名(驼峰) | `User`, `OrderItem` |
| DTO Request | `{业务名}RequestDTO` | `LoginRequestDTO` |
| DTO Response | `{业务名}ResponseDTO` | `UserResponseDTO` |
| Config | `{功能}Config` | `RedisConfig` |
| Interceptor | `{功能}Interceptor` | `AuthInterceptor` |
| Exception | `{功能}Exception` | `BusinessException` |

---

## 八、快速创建项目命令

使用 Spring Initializr:

```bash
# 使用 curl 创建项目
curl https://start.spring.io/starter.tgz \
  -d dependencies=web,mybatis,mysql,redis,lombok \
  -d javaVersion=21 \
  -d name=your-project \
  -o project.zip

# 解压并进入目录
unzip project.zip -d your-project
cd your-project
```

---

*文档版本: v1.0*
*最后更新: 2026-04-09*
