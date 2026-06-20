function FavoritesPage() {
  var _React$useContext = React.useContext(AppCtx);
  var cart = _React$useContext.cart;
  var dispatch = _React$useContext.dispatch;
  var toast = _React$useContext.toast;
  var navigate = _React$useContext.navigate;
  var favorites = _React$useContext.favorites;
  var favDispatch = _React$useContext.favDispatch;

  var _React$useState = React.useState([]);
  var products = _React$useState[0];
  var setProducts = _React$useState[1];

  var _React$useState2 = React.useState(true);
  var loading = _React$useState2[0];
  var setLoading = _React$useState2[1];

  React.useEffect(function() {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(favorites.map(function(id) {
      return fetch('/api/products/' + id).then(function(r) { return r.ok ? r.json() : null; });
    }))
    .then(function(results) {
      setProducts(results.filter(function(p) { return p !== null; }));
      setLoading(false);
    })
    .catch(function() { setLoading(false); toast('error', 'Ошибка загрузки'); });
  }, [favorites]);

  function toggleFav(id) {
    if (favorites.indexOf(id) !== -1) {
      favDispatch({ type: 'REMOVE', id: id });
      toast('success', 'Удалено из избранного');
    }
  }

  function addToCart(p) {
    dispatch({ type: 'ADD', product: p });
    toast('success', '\u00AB' + p.name + '\u00BB \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443');
  }

  var cartIds = React.useMemo(function() { return new Set(cart.map(function(i) { return i.id; })); }, [cart]);

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, 'Загрузка...')
    );
  }

  if (products.length === 0) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-heart-off' }),
      React.createElement('h3', null, 'Избранных товаров нет'),
      React.createElement('button', { className: 'btn btn-primary', style: { marginTop: 16 }, onClick: function() { navigate('catalog'); } },
        React.createElement('i', { className: 'ti ti-arrow-left' }), ' В каталог'
      )
    );
  }

  return React.createElement('div', null,
    React.createElement('h2', { style: { marginBottom: 20 } }, 'Избранное (' + products.length + ')'),
    React.createElement('div', { className: 'grid-auto' },
      products.map(function(p) {
        return React.createElement('div', { key: p.id, className: 'product-card', onClick: function() { navigate('product-' + p.id); } },
          React.createElement('div', { className: 'product-img' },
            p.imageUrl
              ? React.createElement('img', { src: p.imageUrl, alt: p.name })
              : React.createElement('i', { className: 'ti ti-photo', style: { fontSize: 32, color: 'var(--text-hint)' } })
          ),
          React.createElement('div', { className: 'product-body' },
            React.createElement('div', { className: 'product-name' }, p.name),
            React.createElement('div', { className: 'flex-center gap-1', style: { marginBottom: 10 } },
              React.createElement('span', { style: { fontSize: 12, color: '#f59e0b' } }, '\u2605'.repeat(Math.floor(p.rating))),
              React.createElement('span', { className: 'text-sm text-muted' }, p.rating)
            ),
            React.createElement('div', { className: 'product-footer' },
              React.createElement('div', null,
                React.createElement('span', { className: 'product-price' }, p.price.toLocaleString() + ' \u20BD'),
                p.oldPrice && React.createElement('span', { className: 'product-old' }, p.oldPrice.toLocaleString() + ' \u20BD')
              ),
              React.createElement('div', { className: 'flex-center gap-2' },
                React.createElement('button', {
                  className: 'btn btn-sm btn-danger',
                  onClick: function(e) { e.stopPropagation(); toggleFav(p.id); }
                },
                  React.createElement('i', { className: 'ti ti-heart-off' })
                ),
                React.createElement('button', {
                  className: 'btn btn-sm ' + (cartIds.has(p.id) ? 'btn-secondary' : 'btn-primary'),
                  onClick: function(e) { e.stopPropagation(); addToCart(p); }
                },
                  cartIds.has(p.id)
                    ? [React.createElement('i', { key: 'i', className: 'ti ti-check' }), ' \u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435']
                    : [React.createElement('i', { key: 'i', className: 'ti ti-plus' }), ' \u041A\u0443\u043F\u0438\u0442\u044C']
                )
              )
            )
          )
        );
      })
    )
  );
}
