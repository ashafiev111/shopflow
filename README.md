# ShopFlow — интернет-магазин

Full-stack интернет-магазин: React SPA (без сборки, CDN) + Spring Boot 3 + PostgreSQL + Redis.

## Быстрый старт

```bash
docker compose up -d --build
```

Открыть http://localhost:8080

**Админка:** http://localhost:8080/admin — логин `admin`, пароль `admin`

## Архитектура

```
┌─────────────────────────────────────┐
│  React SPA (CDN, без сборки)        │
│  index.html → js/ (React.createElement)
└──────────────┬──────────────────────┘
               │ REST /api/*
┌──────────────▼──────────────────────┐
│  Spring Boot 3 (Java 21)            │
│  JWT auth (HMAC-SHA256, 24ч)        │
│  Flyway миграции                    │
│  Redis cache (категории 1ч, товары 10м)
└──────────────┬──────────────────────┘
               │
     ┌─────────┴─────────┐
     ▼                   ▼
  PostgreSQL          Redis
```

## Технологии

- **Backend:** Java 21, Spring Boot 3.4, Spring Security 6, JPA/Hibernate, Flyway, JJWT
- **Frontend:** React 18 (CDN), Babel Standalone, Tabler Icons
- **DB:** PostgreSQL, Redis
- **Сборка:** Maven, multi-stage Dockerfile

## Роли

| Роль | Доступ |
|------|--------|
| **ADMIN** | Всё, включая управление пользователями |
| **MANAGER** | Дашборд, товары, заказы, категории |
| **CLIENT** | Каталог, корзина, свои заказы (по умолчанию) |

## API

### Публичные
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/products | Товары (с пагинацией `?page=&size=`) |
| GET | /api/products/{id} | Товар по ID |
| GET | /api/categories | Категории |
| POST | /api/auth/login | Вход → `{token, username, role}` |
| POST | /api/auth/register | Регистрация → `{token, username, role}` |
| GET | /api/auth/status | Статус авторизации |
| GET | /api/orders | Заказы (свои для клиента, все для админа) |
| POST | /api/orders | Создать заказ |

### Требуют авторизации (ADMIN/MANAGER)
| Метод | Путь |
|-------|------|
| POST/PATCH/DELETE | /api/products/** |
| POST | /api/products/{id}/image |
| POST/PATCH/DELETE | /api/categories/** |
| PATCH | /api/orders/{id}/status |

### Только ADMIN
| Метод | Путь |
|-------|------|
| GET | /api/users |
| PATCH | /api/users/{id}/role |

## Запуск без Docker

```bash
# PostgreSQL должен быть на localhost:5432
./mvnw package -DskipTests
java -jar target/magazin-1.0-SNAPSHOT.jar
```

## Структура проекта

```
src/main/java/org/example/magazin/
├── config/         # SecurityConfig, JwtUtil, JwtAuthFilter, WebConfig
├── controller/     # REST контроллеры
├── dto/            # DTO
├── exception/      # NotFoundException
├── model/          # JPA entities (Product, Category, Order, OrderItem, User)
├── repository/     # JPA репозитории
└── service/        # Бизнес-логика

src/main/resources/
├── static/         # Frontend
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── App.js, api.js, context.js, data.js
│       └── components/
│           ├── CatalogPage.js, CartPage.js, OrdersPage.js
│           ├── LoginForm.js, RegisterForm.js
│           ├── ProductDetail.js, Sidebar.js, Toasts.js
│           ├── AdminDashboard.js, AdminProducts.js
│           ├── AdminOrders.js, AdminCats.js, AdminUsers.js
│           └── AdminUsers.js
├── db/migration/   # Flyway (V1-V9)
└── application.yml

docker-compose.yml  # app + redis
Dockerfile          # multi-stage
.env.example        # шаблон переменных
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|-------------|----------|
| `APP_PORT` | 8080 | Порт приложения |
| `POSTGRES_PASSWORD` | 123 | Пароль PostgreSQL |
| `JWT_SECRET` | (встроенный) | Secret для JWT (Base64, 256+ бит) |
