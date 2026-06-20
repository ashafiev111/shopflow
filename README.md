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
│  index.html → /js/* (React.createElement)
│  Маршрутизация: WebConfig → forward:/index.html
└──────────────┬──────────────────────┘
               │ REST /api/*
┌──────────────▼──────────────────────┐
│  Spring Boot 3 (Java 21)            │
│  JWT auth (HMAC-SHA256, 24ч)        │
│  Flyway миграции (V1-V11)           │
│  Redis cache (категории 1ч, товары 10м)
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ▼                  ▼
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
| **ADMIN** | Всё, включая управление пользователями и смену ролей |
| **MANAGER** | Дашборд, товары, заказы, категории |
| **CLIENT** | Каталог, корзина, свои заказы, профиль (по умолчанию) |

## API

### Публичные (без авторизации)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/products | Товары (с пагинацией `?page=&size=&category=&search=&sort=`) |
| GET | /api/products/{id} | Товар по ID |
| GET | /api/categories | Категории |
| POST | /api/auth/login | Вход → `{token, username, role}` |
| POST | /api/auth/register | Регистрация → `{token, username, role}` |
| GET | /api/auth/status | Статус авторизации |
| GET | /api/orders | Свои заказы (для клиента), все (для ADMIN/MANAGER) |
| POST | /api/orders | Создать заказ |
| GET | /api/products/{id}/reviews | Отзывы товара |

### Требуют авторизации
| Метод | Путь | Доступ |
|-------|------|--------|
| GET/PATCH | /api/users/me | Любой авторизованный (профиль) |
| POST | /api/products/{id}/reviews | Любой авторизованный |
| DELETE | /api/reviews/{id} | Любой авторизованный |
| POST | /api/products | ADMIN / MANAGER |
| PATCH | /api/products/{id} | ADMIN / MANAGER |
| DELETE | /api/products/{id} | ADMIN / MANAGER |
| POST | /api/products/{id}/image | ADMIN / MANAGER |
| POST | /api/categories | ADMIN / MANAGER |
| PATCH | /api/categories/{id} | ADMIN / MANAGER |
| DELETE | /api/categories/{id} | ADMIN / MANAGER |
| PATCH | /api/orders/{id}/status | ADMIN / MANAGER |
| GET | /api/users | ADMIN |
| PATCH | /api/users/{id}/role | ADMIN |

## Аутентификация

- JWT (HMAC-SHA256, срок 24ч)
- Хранится в `localStorage` под ключом `jwt`
- Отправляется в заголовке `Authorization: Bearer <token>`
- Фильтр `JwtAuthenticationFilter` проверяет токен и проставляет `SecurityContext`
- При отсутствии токена запрос пропускается — решение о доступе принимает `SecurityConfig`

## SPA-маршрутизация

Все SPA-роуты обрабатываются через `WebConfig.addViewControllers` (forward на `/index.html`). Отдельный `SpaController` не требуется.

| Путь | Страница |
|------|----------|
| / | Каталог товаров |
| /catalog | Каталог товаров |
| /product/{id} | Детальная карточка товара |
| /reviews/{id} | Отзывы товара |
| /cart | Корзина |
| /orders | Мои заказы |
| /favorites | Избранное |
| /profile | Мой профиль |
| /login | Вход |
| /register | Регистрация |
| /admin | Панель управления |
| /admin/products | Управление товарами |
| /admin/orders | Управление заказами |
| /admin/cats | Категории |
| /admin/users | Пользователи (только ADMIN) |

## Запуск без Docker

```bash
# PostgreSQL должен быть на localhost:5432
./mvnw package -DskipTests
java -jar target/magazin-1.0-SNAPSHOT.jar
```

## Структура проекта

```
src/main/java/org/example/magazin/
├── config/         # SecurityConfig, JwtUtil, JwtAuthFilter, WebConfig, CacheConfig
├── controller/     # REST контроллеры (Auth, Product, Category, Order, Review, User)
├── dto/            # DTO (ProductDto, CategoryDto, OrderDto, ReviewDto, UserDto, RegisterRequest, UpdateProfileRequest)
├── exception/      # NotFoundException + GlobalExceptionHandler
├── model/          # JPA entities (Product, Category, Order, OrderItem, Review, User)
├── repository/     # JPA репозитории
└── service/        # Бизнес-логика (ProductService, CategoryService, OrderService)

src/main/resources/
├── static/         # Frontend SPA
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── App.js, api.js, context.js, data.js
│       └── components/
│           ├── CatalogPage.js, CartPage.js, OrdersPage.js
│           ├── ProductDetail.js, ReviewsPage.js, FavoritesPage.js
│           ├── LoginForm.js, RegisterForm.js, ProfilePage.js
│           ├── Sidebar.js, Toasts.js
│           ├── AdminDashboard.js, AdminProducts.js
│           ├── AdminOrders.js, AdminCats.js, AdminUsers.js
├── db/migration/   # Flyway (V1-V11)
└── application.yml

frontend/           # Редактируемая копия frontend (синхронизируется вручную)
├── index.html
├── css/style.css
└── js/...

docker-compose.yml  # app + redis + postgresql
Dockerfile          # multi-stage (mvn package → java -jar)
.env.example        # шаблон переменных окружения
uploads/            # Изображения товаров
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|-------------|----------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/magazin` | JDBC URL PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Пользователь БД |
| `SPRING_DATASOURCE_PASSWORD` | `123` | Пароль БД |
| `SPRING_DATA_REDIS_HOST` | `localhost` | Хост Redis |
| `APP_UPLOAD_DIR` | `uploads` | Директория для изображений |
| `APP_JWT_SECRET` | (встроенный) | Secret для JWT (Base64, 256+ бит) |
