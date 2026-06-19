function CatalogPage(_ref) {
  var setPage = _ref.setPage;
  var _React$useContext = React.useContext(AppCtx);
  var cart = _React$useContext.cart;
  var dispatch = _React$useContext.dispatch;
  var toast = _React$useContext.toast;

  var _React$useState = React.useState([]);
  var products = _React$useState[0];
  var setProducts = _React$useState[1];

  var _React$useState2 = React.useState([]);
  var categories = _React$useState2[0];
  var setCategories = _React$useState2[1];

  var _React$useState3 = React.useState(true);
  var loading = _React$useState3[0];
  var setLoading = _React$useState3[1];

  var _React$useState4 = React.useState('');
  var search = _React$useState4[0];
  var setSearch = _React$useState4[1];

  var _React$useState5 = React.useState(null);
  var activeCat = _React$useState5[0];
  var setActiveCat = _React$useState5[1];

  var _React$useState6 = React.useState('default');
  var sort = _React$useState6[0];
  var setSort = _React$useState6[1];

  var cartIds = React.useMemo(function() { return new Set(cart.map(function(i) { return i.id; })); }, [cart]);

  React.useEffect(function() {
    fetch('/api/categories')
      .then(function(r) { return r.json(); })
      .then(setCategories)
      .catch(function() { toast('error', 'Ошибка загрузки категорий'); });
  }, []);

  React.useEffect(function() {
    setLoading(true);
    var params = new URLSearchParams();
    if (activeCat) params.set('category', activeCat);
    if (search) params.set('search', search);
    if (sort !== 'default') params.set('sort', sort);
    fetch('/api/products?' + params.toString())
      .then(function(r) { return r.json(); })
      .then(function(data) { setProducts(data); setLoading(false); })
      .catch(function() { toast('error', 'Ошибка загрузки товаров'); setLoading(false); });
  }, [activeCat, search, sort]);

  function addToCart(p) {
    dispatch({ type: 'ADD', product: p });
    toast('success', '\u00AB' + p.name + '\u00BB \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443');
  }

  function catName(id) { var c = categories.find(function(c) { return c.id === id; }); return c ? c.name : ''; }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...')
    );
  }

  return React.createElement('div', null,
    React.createElement('div', { className: 'flex-center gap-3 mb-6', style: { flexWrap: 'wrap' } },
      React.createElement('div', { className: 'search-box', style: { flex: 1, minWidth: 220 } },
        React.createElement('i', { className: 'ti ti-search' }),
        React.createElement('input', { placeholder: '\u041F\u043E\u0438\u0441\u043A \u0442\u043E\u0432\u0430\u0440\u043E\u0432...', value: search, onChange: function(e) { setSearch(e.target.value); } })
      ),
      React.createElement('select', { className: 'form-input', style: { width: 160 }, value: sort, onChange: function(e) { setSort(e.target.value); } },
        React.createElement('option', { value: 'default' }, '\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E'),
        React.createElement('option', { value: 'price-asc' }, '\u0426\u0435\u043D\u0430 \u2191'),
        React.createElement('option', { value: 'price-desc' }, '\u0426\u0435\u043D\u0430 \u2193'),
        React.createElement('option', { value: 'rating' }, '\u041F\u043E \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0443')
      )
    ),
    React.createElement('div', { className: 'flex gap-2 mb-6', style: { flexWrap: 'wrap' } },
      React.createElement('button', {
        className: 'pill ' + (activeCat === null ? 'active' : ''),
        onClick: function() { setActiveCat(null); }
      }, '\u0412\u0441\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438'),
      categories.map(function(c) {
        return React.createElement('button', {
          key: c.id,
          className: 'pill ' + (activeCat === c.id ? 'active' : ''),
          onClick: function() { setActiveCat(c.id); }
        }, c.icon + ' ' + c.name);
      })
    ),
    products.length === 0
      ? React.createElement('div', { className: 'empty' },
          React.createElement('i', { className: 'ti ti-mood-sad' }),
          React.createElement('h3', null, '\u0422\u043E\u0432\u0430\u0440\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B'),
          React.createElement('p', null, '\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B \u0438\u043B\u0438 \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441')
        )
      : React.createElement('div', { className: 'grid-auto' },
          products.map(function(p) {
            return React.createElement('div', { key: p.id, className: 'product-card', onClick: function() { setPage('product-' + p.id); } },
              React.createElement('div', { className: 'product-img' }, p.imageUrl ? React.createElement('img', { src: p.imageUrl, alt: p.name }) : React.createElement('i', { className: 'ti ti-photo', style: { fontSize: 32, color: 'var(--text-hint)' } })),
              React.createElement('div', { className: 'product-body' },
                React.createElement('div', { className: 'product-cat' }, catName(p.categoryId)),
                React.createElement('div', { className: 'product-name' }, p.name),
                React.createElement('div', { className: 'flex-center gap-1', style: { marginBottom: 10 } },
                  React.createElement('span', { style: { fontSize: 12, color: '#f59e0b' } }, '\u2605'.repeat(Math.floor(p.rating))),
                  React.createElement('span', { className: 'text-sm text-muted' }, p.rating + ' (' + p.sold + ')')
                ),
                React.createElement('div', { className: 'product-footer' },
                  React.createElement('div', null,
                    React.createElement('span', { className: 'product-price' }, p.price.toLocaleString() + ' \u20BD'),
                    p.oldPrice && React.createElement('span', { className: 'product-old' }, p.oldPrice.toLocaleString() + ' \u20BD')
                  ),
                  React.createElement('button', {
                    className: 'btn btn-sm ' + (cartIds.has(p.id) ? 'btn-secondary' : 'btn-primary'),
                    onClick: function() { addToCart(p); }
                  },
                    cartIds.has(p.id)
                      ? [React.createElement('i', { key: 'i', className: 'ti ti-check' }), ' \u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435']
                      : [React.createElement('i', { key: 'i', className: 'ti ti-plus' }), ' \u041A\u0443\u043F\u0438\u0442\u044C']
                  )
                )
              )
            );
          })
        )
  );
}
