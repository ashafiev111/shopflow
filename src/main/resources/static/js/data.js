var ORDER_STATUS = { pending: 'Ожидает', processing: 'В обработке', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён' };
var STATUS_BADGE = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };

var MENU = [
  { section: 'Магазин' },
  { id: 'catalog', label: 'Каталог', icon: 'ti-layout-grid' },
  { id: 'cart', label: 'Корзина', icon: 'ti-shopping-cart', badge: true },
  { id: 'orders', label: 'Заказы', icon: 'ti-receipt' },
  { section: 'Управление' },
  { id: 'admin', label: 'Обзор', icon: 'ti-dashboard', admin: true },
  { id: 'admin-products', label: 'Товары', icon: 'ti-package', admin: true },
  { id: 'admin-orders', label: 'Заказы', icon: 'ti-clipboard-list', admin: true },
  { id: 'admin-cats', label: 'Категории', icon: 'ti-tags', admin: true },
];

var PAGE_TITLES = {
  catalog: 'Каталог товаров',
  cart: 'Корзина',
  orders: 'Мои заказы',
  admin: 'Панель управления',
  'admin-products': 'Управление товарами',
  'admin-orders': 'Управление заказами',
  'admin-cats': 'Категории',
};

var DEFAULT_TITLE = 'ShopFlow';
