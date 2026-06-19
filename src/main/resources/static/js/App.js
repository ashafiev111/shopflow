function App() {
  var _React$useState = React.useState('catalog');
  var page = _React$useState[0];
  var setPage = _React$useState[1];

  var initialCart = (function() {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch(e) { return []; }
  })();
  var _React$useReducer = React.useReducer(cartReducer, initialCart);
  var cart = _React$useReducer[0];
  var dispatch = _React$useReducer[1];

  React.useEffect(function() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  var _React$useState2 = React.useState([]);
  var toasts = _React$useState2[0];
  var setToasts = _React$useState2[1];

  var _React$useState3 = React.useState(null);
  var user = _React$useState3[0];
  var setUser = _React$useState3[1];

  React.useEffect(function() {
    fetch('/api/auth/status')
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function(d) { setUser(d); })
      .catch(function() { setUser(null); });
  }, []);

  var cartCount = cart.reduce(function(s, i) { return s + i.qty; }, 0);

  var addToast = React.useCallback(function(type, msg) {
    var id = Date.now();
    setToasts(function(t) { return t.concat([{ id: id, type: type, msg: msg }]); });
    setTimeout(function() { setToasts(function(t) { return t.filter(function(x) { return x.id !== id; }); }); }, 3000);
  }, []);

  var isAdminPage = page && (page === 'admin' || page.startsWith('admin-'));
  var pageTitle = page && page.startsWith('product-') ? '\u0422\u043E\u0432\u0430\u0440' : (PAGE_TITLES[page] || '');
  var pageContent;
  if (isAdminPage && !user) {
    pageContent = React.createElement(LoginForm, {
      onLogin: function(u) { setUser({ username: u }); },
      onClose: function() { setPage('catalog'); }
    });
  } else if (page && page.startsWith('product-')) {
    pageContent = React.createElement(ProductDetail, { page: page, setPage: setPage });
  } else {
    var Comp = ROUTES[page] || ROUTES.catalog;
    pageContent = React.createElement(Comp, { setPage: setPage });
  }

  return React.createElement(AppCtx.Provider, { value: { cart: cart, dispatch: dispatch, toast: addToast, user: user, setUser: setUser, setPage: setPage } },
    React.createElement('div', { className: 'layout' },
      React.createElement(Sidebar, { page: page, setPage: setPage, cartCount: cartCount, user: user, setUser: setUser }),
      React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'topbar' },
          React.createElement('span', { className: 'topbar-title' }, pageTitle),
          React.createElement('div', { className: 'topbar-actions' },
            page === 'catalog' && React.createElement('button', { className: 'btn btn-secondary btn-sm', onClick: function() { setPage('cart'); } },
              React.createElement('i', { className: 'ti ti-shopping-cart' }),
              '\u041A\u043E\u0440\u0437\u0438\u043D\u0430',
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
