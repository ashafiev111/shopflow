var ORDER_STATUS = { pending: 'Ожидает', processing: 'В обработке', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён' };
var STATUS_BADGE = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };

var ROLE_LABELS = { CLIENT: 'Клиент', MANAGER: 'Менеджер', ADMIN: 'Администратор' };
var ROLE_COLORS = { CLIENT: 'rgba(255,255,255,0.4)', MANAGER: '#f59e0b', ADMIN: '#10b981' };

var MENU = [
  { section: 'Магазин' },
  { id: 'catalog', label: 'Каталог', icon: 'ti-layout-grid' },
  { id: 'cart', label: 'Корзина', icon: 'ti-shopping-cart', badge: true },
  { id: 'orders', label: 'Заказы', icon: 'ti-receipt' },
  { section: 'Управление' },
  { id: 'admin', label: 'Обзор', icon: 'ti-dashboard', roles: ['ADMIN', 'MANAGER'] },
  { id: 'admin-products', label: 'Товары', icon: 'ti-package', roles: ['ADMIN', 'MANAGER'] },
  { id: 'admin-orders', label: 'Заказы', icon: 'ti-clipboard-list', roles: ['ADMIN', 'MANAGER'] },
  { id: 'admin-cats', label: 'Категории', icon: 'ti-tags', roles: ['ADMIN', 'MANAGER'] },
  { id: 'admin-users', label: 'Пользователи', icon: 'ti-users', roles: ['ADMIN'] },
];

var PAGE_TITLES = {
  catalog: 'Каталог товаров',
  cart: 'Корзина',
  orders: 'Мои заказы',
  login: 'Вход',
  register: 'Регистрация',
  admin: 'Панель управления',
  'admin-products': 'Управление товарами',
  'admin-orders': 'Управление заказами',
  'admin-cats': 'Категории',
  'admin-users': 'Пользователи',
};

var DEFAULT_TITLE = 'ShopFlow';
