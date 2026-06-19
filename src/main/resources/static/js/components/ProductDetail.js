function ProductDetail(_ref) {
  var page = _ref.page;
  var setPage = _ref.setPage;

  var productId = React.useMemo(function() { return parseInt(page.replace('product-', ''), 10) || 0; }, [page]);

  var _React$useContext = React.useContext(AppCtx);
  var cart = _React$useContext.cart;
  var dispatch = _React$useContext.dispatch;
  var toast = _React$useContext.toast;
  var navigate = _React$useContext.navigate;

  var _React$useState = React.useState(null);
  var product = _React$useState[0];
  var setProduct = _React$useState[1];

  var _React$useState2 = React.useState([]);
  var categories = _React$useState2[0];
  var setCategories = _React$useState2[1];

  var _React$useState3 = React.useState(true);
  var loading = _React$useState3[0];
  var setLoading = _React$useState3[1];

  React.useEffect(function() {
    setLoading(true);
    Promise.all([
      fetch('/api/products/' + productId).then(function(r) { return r.ok ? r.json() : Promise.reject(); }),
      fetch('/api/categories').then(function(r) { return r.json(); })
    ])
    .then(function(_ref2) {
      var p = _ref2[0];
      var c = _ref2[1];
      setProduct(p);
      setCategories(c);
      setLoading(false);
    })
    .catch(function() { setLoading(false); });
  }, [productId]);

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...')
    );
  }

  if (!product) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-mood-sad' }),
      React.createElement('h3', null, '\u0422\u043E\u0432\u0430\u0440 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D'),
      React.createElement('button', { className: 'btn btn-primary', style: { marginTop: 16 }, onClick: function() { navigate('catalog'); } },
        React.createElement('i', { className: 'ti ti-arrow-left' }), ' \u0412 \u043A\u0430\u0442\u0430\u043B\u043E\u0433'
      )
    );
  }

  var catName = (function() { var c = categories.find(function(c) { return c.id === product.categoryId; }); return c ? c.name : ''; })();
  var inCart = cart.some(function(i) { return i.id === product.id; });

  return React.createElement('div', { className: 'product-detail' },
    React.createElement('div', { className: 'product-detail-back' },
      React.createElement('button', { className: 'btn btn-ghost', onClick: function() { navigate('catalog'); } },
        React.createElement('i', { className: 'ti ti-arrow-left' }), ' \u041D\u0430\u0437\u0430\u0434 \u0432 \u043A\u0430\u0442\u0430\u043B\u043E\u0433'
      )
    ),
    React.createElement('div', { className: 'product-detail-grid' },
      React.createElement('div', { className: 'product-detail-img' },
        product.imageUrl
          ? React.createElement('img', { src: product.imageUrl, alt: product.name })
          : React.createElement('i', { className: 'ti ti-photo', style: { fontSize: 64, color: 'var(--text-hint)' } })
      ),
      React.createElement('div', { className: 'product-detail-info' },
        React.createElement('div', { className: 'product-detail-cat' }, catName),
        React.createElement('h1', { className: 'product-detail-name' }, product.name),
        React.createElement('div', { className: 'product-detail-rating' },
          React.createElement('span', { style: { color: '#f59e0b', fontSize: 16 } }, '\u2605'.repeat(Math.floor(product.rating))),
          React.createElement('span', { className: 'text-muted', style: { marginLeft: 6 } }, product.rating + ' (\u043F\u0440\u043E\u0434\u0430\u043D\u043E ' + product.sold + ')')
        ),
        product.oldPrice
          ? React.createElement('div', { className: 'product-detail-price' },
              React.createElement('span', { className: 'product-detail-current' }, product.price.toLocaleString() + ' \u20BD'),
              React.createElement('span', { className: 'product-detail-old' }, product.oldPrice.toLocaleString() + ' \u20BD')
            )
          : React.createElement('div', { className: 'product-detail-price' },
              React.createElement('span', { className: 'product-detail-current' }, product.price.toLocaleString() + ' \u20BD')
            ),
        React.createElement('div', { className: 'product-detail-stock' },
          product.stock > 0
            ? React.createElement('span', { style: { color: 'var(--success)' } }, '\u0412 \u043D\u0430\u043B\u0438\u0447\u0438\u0438: ' + product.stock + ' \u0448\u0442.')
            : React.createElement('span', { style: { color: 'var(--danger)' } }, '\u041D\u0435\u0442 \u0432 \u043D\u0430\u043B\u0438\u0447\u0438\u0438')
        ),
        React.createElement('button', {
          className: 'btn ' + (inCart ? 'btn-secondary' : 'btn-primary'),
          style: { width: '100%', justifyContent: 'center', padding: 12, fontSize: 15, marginTop: 8 },
          onClick: function() {
            if (inCart) { navigate('cart'); return; }
            dispatch({ type: 'ADD', product: product });
            toast('success', '\u00AB' + product.name + '\u00BB \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443');
          },
          disabled: product.stock < 1
        },
          inCart
            ? [React.createElement('i', { key: 'i', className: 'ti ti-check' }), ' \u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435']
            : [React.createElement('i', { key: 'i', className: 'ti ti-shopping-cart' }), ' \u041A\u0443\u043F\u0438\u0442\u044C']
        )
      )
    )
  );
}
