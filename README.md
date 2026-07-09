# CinePro Backend

Backend microservices NestJS cho hệ thống đặt vé rạp chiếu phim.

## Công Nghệ

- NestJS monorepo
- TCP microservices
- PostgreSQL
- TypeORM

## Yêu Cầu

- Node.js 22+
- npm 11+
- Docker Desktop hoặc Docker Engine

## Setup Local Nhanh

1. Tạo file môi trường local:

```bash
cp .env.example .env
```

2. Khởi động hạ tầng local gồm PostgreSQL, Redis và RabbitMQ:

```bash
docker compose up -d
```

3. Kiểm tra container:

```bash
docker compose ps
```

4. Cài dependencies:

```bash
npm install
```

5. Chạy migration để đồng bộ database:

```bash
npm run migration:run
```

6. Chạy API Gateway:

```bash
npm run start:gateway
```

## Cấu Hình Môi Trường

Các biến hạ tầng local mặc định:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cinepro
DB_SYNCHRONIZE=true
DB_LOGGING=false

REDIS_HOST=localhost
REDIS_PORT=6379

RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

Khi phát triển theo migration, nên tắt tự đồng bộ schema:

```env
DB_SYNCHRONIZE=false
```

## Cài Đặt

```bash
npm install
```

Khởi động hạ tầng local:

```bash
docker compose up -d
```

Build toàn bộ app:

```bash
npm run build:all
```

## Chạy Dịch Vụ

Chạy API Gateway:

```bash
npm run start:gateway
```

Chạy từng service ở các terminal riêng:

```bash
npm run start:auth-user
npm run start:movie
npm run start:cinema-showtime
npm run start:booking
npm run start:payment
npm run start:ticket
npm run start:notification
npm run start:product
```

Kiểm tra API Gateway còn sống:

```bash
curl http://localhost:3000/api/v1/health
```

Kiểm tra gateway gọi health của các service con:

```bash
curl http://localhost:3000/api/v1/health/services
```

Khởi động hạ tầng local bằng Docker:

```bash
docker compose up -d
```

Lưu ý: Docker Compose hiện chỉ chạy hạ tầng local gồm PostgreSQL, Redis và RabbitMQ. Các app NestJS vẫn chạy local bằng `npm run start:<service>`.

## Hạ Tầng Docker Local

`docker-compose.yml` cung cấp:

- PostgreSQL `postgres:16-alpine`
- Redis `redis:7-alpine`
- RabbitMQ `rabbitmq:3-management-alpine`

Port exposed:

```txt
PostgreSQL: localhost:5433 -> container:5432
Redis:      localhost:6379 -> container:6379
RabbitMQ:   localhost:5672 -> container:5672
RabbitMQ UI localhost:15672 -> container:15672
```

RabbitMQ Management UI:

```txt
URL:      http://localhost:15672
Username: guest
Password: guest
```

Các service hạ tầng dùng network riêng:

```txt
cinepro-network
```

Các volume dữ liệu:

```txt
cinepro-postgres-data
cinepro-redis-data
cinepro-rabbitmq-data
```

## Cấu Hình DBeaver

Kết nối PostgreSQL bằng DBeaver:

```txt
Host:     localhost
Port:     5433
Database: cinepro
Username: postgres
Password: postgres
```

## Migration Database

Project đang dùng chung một PostgreSQL database cho các service, nên migration được quản lý tập trung trong `libs/database`.

File cấu hình datasource của TypeORM:

```txt
libs/database/src/typeorm.config.ts
```

Các file migration được lưu tại:

```txt
libs/database/src/migrations
```

Trước khi chạy lệnh migration, cần đảm bảo PostgreSQL đang chạy:

```bash
docker compose up -d
```

Tạo migration từ thay đổi trong entity:

```bash
npm run migration:generate -- libs/database/src/migrations/InitSchema
```

Tạo một migration rỗng để tự viết SQL:

```bash
npm run migration:create -- libs/database/src/migrations/AddSomething
```

Chạy các migration chưa chạy và đồng bộ thay đổi lên database:

```bash
npm run migration:run
```

Xem trạng thái migration:

```bash
npm run migration:show
```

Rollback migration mới nhất:

```bash
npm run migration:revert
```

Xem trước SQL thay đổi schema nhưng chưa áp dụng vào database:

```bash
npm run schema:log
```

Đồng bộ schema từ entity trực tiếp lên database:

```bash
npm run schema:sync
```

Chỉ dùng `schema:sync` khi phát triển local. Với môi trường dùng chung, staging hoặc production, nên dùng `migration:generate` và `migration:run` để mọi thay đổi database được version hóa.

## Quy Trình Chạy Database Lần Đầu

1. Tạo file `.env`:

```bash
cp .env.example .env
```

2. Khởi động hạ tầng local:

```bash
docker compose up -d
```

3. Tạo migration đầu tiên từ các entity hiện có:

```bash
npm run migration:generate -- libs/database/src/migrations/InitSchema
```

4. Chạy migration để tạo bảng trong database:

```bash
npm run migration:run
```

5. Kiểm tra trạng thái migration:

```bash
npm run migration:show
```

## Cách Dùng Database Module

Các service chỉ cần import database module dùng chung cùng danh sách entity:

```ts
DatabaseModule.forRoot([Movie])
```

Khi service khởi động và TypeORM kết nối database thành công, log sẽ có dạng:

```txt
PostgreSQL connected: localhost:5433/cinepro (1 entities)
```
