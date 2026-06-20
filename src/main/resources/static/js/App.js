function pageToUrl(p) {
  if (!p || p === 'catalog') return '/';
  if (p.startsWith('product-')) return '/product/' + p.replace('product-', '');
  if (p.startsWith('reviews-')) return '/reviews/' + p.replace('reviews-', '');
  if (p.startsWith('admin-')) return '/admin/' + p.replace('admin-', '');
  return '/' + p;
}

function urlToPage() {
  var path = window.location.pathname;
  if (path === '/' || path === '/catalog') return 'catalog';
  var m = path.match(/^\/product\/(\d+)$/);
  if (m) return 'product-' + m[1];
  m = path.match(/^\/reviews\/(\d+)$/);
  if (m) return 'reviews-' + m[1];
  if (path === '/admin') return 'admin';
  m = path.match(/^\/(admin\/.+)$/);
  if (m) return m[1].replace('/', '-');
  return path.replace(/^\//, '') || 'catalog';
}

function App() {
  var _React$useState = React.useState(urlToPage);
  var page = _React$useState[0];
  var setPage = _React$useState[1];

  var navigate = React.useCallback(function(p) {
    var url = pageToUrl(p);
    history.pushState(null, '', url);
    setPage(p);
  }, []);

  React.useEffect(function() {
    function onPop() { setPage(urlToPage()); }
    addEventListener('popstate', onPop);
    return function() { removeEventListener('popstate', onPop); };
  }, []);

  var initialCart = (function() {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch(e) { return []; }
  })();
  var _React$useReducer = React.useReducer(cartReducer, initialCart);
  var cart = _React$useReducer[0];
  var dispatch = _React$useReducer[1];

  React.useEffect(function() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  var initialFav = (function() {
    try { return JSON.parse(localStorage.getItem('favorites')) || []; } catch(e) { return []; }
  })();
  var _React$useReducer2 = React.useReducer(favoritesReducer, initialFav);
  var favorites = _React$useReducer2[0];
  var favDispatch = _React$useReducer2[1];

  React.useEffect(function() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  var _React$useState2 = React.useState([]);
  var toasts = _React$useState2[0];
  var setToasts = _React$useState2[1];

  var _React$useState3 = React.useState(null);
  var user = _React$useState3[0];
  var setUser = _React$useState3[1];

  var _React$useState4 = React.useState(function() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });
  var theme = _React$useState4[0];
  var setTheme = _React$useState4[1];

  React.useEffect(function() {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  React.useEffect(function() {
    if (!getToken()) return;
    fetchWithAuth('/api/auth/status')
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function(d) { setUser(d); })
      .catch(function() { setToken(null); setUser(null); });
  }, []);

  var cartCount = cart.reduce(function(s, i) { return s + i.qty; }, 0);

  var addToast = React.useCallback(function(type, msg) {
    var id = Date.now();
    setToasts(function(t) { return t.concat([{ id: id, type: type, msg: msg }]); });
    setTimeout(function() { setToasts(function(t) { return t.filter(function(x) { return x.id !== id; }); }); }, 3000);
  }, []);

  var isAdminPage = page && (page === 'admin' || page.startsWith('admin-'));
  var canAccessAdmin = user && (user.role === 'ADMIN' || user.role === 'MANAGER');
  var pageTitle = page && page.startsWith('product-') ? 'Товар' : (PAGE_TITLES[page] || '');
  var pageContent;

  if (isAdminPage && !user) {
    pageContent = React.createElement(LoginForm, {
      onLogin: function(u, r) { setUser({ username: u, role: r }); navigate(page); },
      onClose: function() { navigate('catalog'); }
    });
  } else if (isAdminPage && !canAccessAdmin) {
    pageContent = React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-lock' }),
      React.createElement('h3', null, 'Доступ запрещён'),
      React.createElement('p', null, 'У вас нет прав для доступа к этому разделу')
    );
  } else if (page && page.startsWith('product-')) {
    pageContent = React.createElement(ProductDetail, { page: page, setPage: navigate });
  } else if (page && page.startsWith('reviews-')) {
    pageContent = React.createElement(ReviewsPage, { page: page, setPage: navigate });
  } else if (page === 'profile') {
    pageContent = React.createElement(ProfilePage, null);
  } else if (page === 'favorites') {
    pageContent = React.createElement(FavoritesPage, null);
  } else if (page === 'login') {
    pageContent = React.createElement(LoginForm, {
      onLogin: function(u, r) { setUser({ username: u, role: r }); navigate('catalog'); },
      onClose: function() { navigate('catalog'); }
    });
  } else if (page === 'register') {
    pageContent = React.createElement(RegisterForm, {
      onRegister: function(u, r) { setUser({ username: u, role: r }); navigate('catalog'); },
      onClose: function() { navigate('login'); }
    });
  } else {
    var Comp = ROUTES[page] || ROUTES.catalog;
    pageContent = React.createElement(Comp, { setPage: navigate });
  }

  return React.createElement(AppCtx.Provider, { value: { cart: cart, dispatch: dispatch, favorites: favorites, favDispatch: favDispatch, toast: addToast, user: user, setUser: setUser, navigate: navigate, theme: theme, setTheme: setTheme } },
    React.createElement('div', { className: 'layout' },
      React.createElement(Sidebar, { page: page, cartCount: cartCount, user: user, setUser: setUser }),
      React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'topbar' },
          React.createElement('span', { className: 'topbar-title' }, pageTitle),
          React.createElement('div', { className: 'topbar-actions' },
            page === 'catalog' && React.createElement('button', { className: 'btn btn-secondary btn-sm', onClick: function() { navigate('cart'); } },
              React.createElement('i', { className: 'ti ti-shopping-cart' }),
              'Корзина',
              cartCount > 0 && React.createElement('span', { className: 'nav-badge', style: { background: 'var(--accent)' } }, cartCount)
            )
          )
        ),
        React.createElement('div', { className: 'page' }, pageContent)
      )
    ),
    React.createElement(Toasts, { toasts: toasts })
  );
}
