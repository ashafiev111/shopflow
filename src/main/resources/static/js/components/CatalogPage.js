function CatalogPage(_ref) {
  var setPage = _ref.setPage;

  var _React$useContext = React.useContext(AppCtx);
  var cart = _React$useContext.cart;
  var dispatch = _React$useContext.dispatch;
  var toast = _React$useContext.toast;
  var navigate = _React$useContext.navigate;
  var favorites = _React$useContext.favorites;
  var favDispatch = _React$useContext.favDispatch;

  var _useState = React.useState([]);
  var products = _useState[0];
  var setProducts = _useState[1];

  var _useState2 = React.useState([]);
  var categories = _useState2[0];
  var setCategories = _useState2[1];

  var _useState3 = React.useState(true);
  var loading = _useState3[0];
  var setLoading = _useState3[1];

  var _useState4 = React.useState('');
  var search = _useState4[0];
  var setSearch = _useState4[1];

  var _useState5 = React.useState(null);
  var activeCat = _useState5[0];
  var setActiveCat = _useState5[1];

  var _useState6 = React.useState('default');
  var sort = _useState6[0];
  var setSort = _useState6[1];

  var _useState7 = React.useState(0);
  var curPage = _useState7[0];
  var setCurPage = _useState7[1];

  var _useState8 = React.useState(10);
  var size = _useState8[0];
  var setSize = _useState8[1];

  var _useState9 = React.useState(0);
  var totalPages = _useState9[0];
  var setTotalPages = _useState9[1];

  var cartIds = React.useMemo(function() { return new Set(cart.map(function(i) { return i.id; })); }, [cart]);

  React.useEffect(function() {
    fetch('/api/categories')
      .then(function(r) { return r.json(); })
      .then(setCategories)
      .catch(function() { toast('error', 'Ошибка загрузки категорий'); });
  }, []);

  React.useEffect(function() {
    var cancelled = false;
    setLoading(true);
    var params = new URLSearchParams();
    if (activeCat) params.set('category', activeCat);
    if (search) params.set('search', search);
    if (sort !== 'default') params.set('sort', sort);
    params.set('page', String(curPage));
    params.set('size', String(size));
    fetch('/api/products?' + params.toString())
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!cancelled) {
          setProducts(data.content || []);
          setTotalPages(data.totalPages || 0);
          setLoading(false);
        }
      })
      .catch(function() { if (!cancelled) { toast('error', 'Ошибка загрузки товаров'); setLoading(false); } });
    return function() { cancelled = true; };
  }, [activeCat, search, sort, curPage, size]);

  function goSearch(e) {
    setSearch(e.target.value);
    setCurPage(0);
  }

  function goCat(catId) {
    setActiveCat(catId);
    setCurPage(0);
  }

  function goSort(e) {
    setSort(e.target.value);
    setCurPage(0);
  }

  function goSize(e) {
    setSize(+e.target.value);
    setCurPage(0);
  }

  function addToCart(p) {
    dispatch({ type: 'ADD', product: p });
    toast('success', '\u00AB' + p.name + '\u00BB \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443');
  }

  function toggleFav(id) {
    var isFav = favorites.indexOf(id) !== -1;
    favDispatch({ type: isFav ? 'REMOVE' : 'ADD', id: id });
    toast('success', isFav ? '\u0423\u0434\u0430\u043B\u0435\u043D\u043E \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E' : '\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0432 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435');
  }

  function catName(id) { var c = categories.find(function(c) { return c.id === id; }); return c ? c.name : ''; }

  function pageButtons() {
    if (totalPages <= 1) return null;
    var items = [];
    if (curPage > 0) {
      items.push(React.createElement('button', {
        key: 'p',
        className: 'btn btn-secondary btn-sm',
        onClick: function() { setCurPage(curPage - 1); }
      }, '\u2190'));
    }
    for (var pi = 0; pi < totalPages; pi++) {
      items.push(React.createElement('button', {
        key: pi,
        className: 'btn ' + (pi === curPage ? 'btn-primary' : 'btn-secondary') + ' btn-sm',
        onClick: (function(idx) { return function() { setCurPage(idx); }; })(pi)
      }, String(pi + 1)));
    }
    if (curPage < totalPages - 1) {
      items.push(React.createElement('button', {
        key: 'n',
        className: 'btn btn-secondary btn-sm',
        onClick: function() { setCurPage(curPage + 1); }
      }, '\u2192'));
    }
    return React.createElement('div', { className: 'flex-center gap-2', style: { justifyContent: 'center', marginTop: 20 } }, items);
  }

  return React.createElement('div', null,
    React.createElement('div', { className: 'flex-center gap-3 mb-6', style: { flexWrap: 'wrap' } },
      React.createElement('div', { className: 'search-box', style: { flex: 1, minWidth: 220 } },
        React.createElement('i', { className: 'ti ti-search' }),
        React.createElement('input', { placeholder: 'Поиск товаров...', value: search, onChange: goSearch })
      ),
      React.createElement('select', { className: 'form-input', style: { width: 140 }, value: sort, onChange: goSort },
        React.createElement('option', { value: 'default' }, 'По умолчанию'),
        React.createElement('option', { value: 'price-asc' }, 'Цена ↑'),
        React.createElement('option', { value: 'price-desc' }, 'Цена ↓'),
        React.createElement('option', { value: 'rating' }, 'По рейтингу')
      ),
      React.createElement('select', { className: 'form-input', style: { width: 100 }, value: size, onChange: goSize },
        React.createElement('option', { value: 10 }, '10'),
        React.createElement('option', { value: 20 }, '20'),
        React.createElement('option', { value: 50 }, '50')
      )
    ),
    React.createElement('div', { className: 'flex gap-2 mb-6', style: { flexWrap: 'wrap' } },
      React.createElement('button', {
        className: 'pill ' + (activeCat === null ? 'active' : ''),
        onClick: function() { goCat(null); }
      }, 'Все категории'),
      categories.map(function(c) {
        return React.createElement('button', {
          key: c.id,
          className: 'pill ' + (activeCat === c.id ? 'active' : ''),
          onClick: function() { goCat(c.id); }
        }, c.icon + ' ' + c.name);
      })
    ),
    loading
      ? React.createElement('div', { className: 'empty', style: { padding: '40px 20px' } },
          React.createElement('i', { className: 'ti ti-loader' }),
          React.createElement('h3', null, 'Загрузка...')
        )
      : products.length === 0
        ? React.createElement('div', { className: 'empty' },
            React.createElement('i', { className: 'ti ti-mood-sad' }),
            React.createElement('h3', null, 'Товары не найдены'),
            React.createElement('p', null, 'Попробуйте изменить фильтры или поисковый запрос')
          )
        : React.createElement('div', null,
            React.createElement('div', { className: 'grid-auto' },
              products.map(function(p) {
                return React.createElement('div', { key: p.id, className: 'product-card', onClick: function() { navigate('product-' + p.id); } },
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
                        React.createElement('span', { className: 'product-price' }, p.price.toLocaleString() + ' ₽'),
                        p.oldPrice && React.createElement('span', { className: 'product-old' }, p.oldPrice.toLocaleString() + ' ₽')
                      ),
                      React.createElement('div', { className: 'flex-center gap-2' },
                        React.createElement('button', {
                          className: 'btn btn-sm btn-secondary',
                          onClick: function(e) { e.stopPropagation(); toggleFav(p.id); }
                        },
                          React.createElement('i', {
                            className: 'ti ti-heart',
                            style: { color: favorites.indexOf(p.id) !== -1 ? '#dc2626' : '' }
                          })
                        ),
                        React.createElement('button', {
                          className: 'btn btn-sm ' + (cartIds.has(p.id) ? 'btn-secondary' : 'btn-primary'),
                          onClick: function(e) { e.stopPropagation(); addToCart(p); }
                        },
                          cartIds.has(p.id)
                            ? [React.createElement('i', { key: 'i', className: 'ti ti-check' }), ' В корзине']
                            : [React.createElement('i', { key: 'i', className: 'ti ti-plus' }), ' Купить']
                        )
                      )
                    )
                  )
                );
              })
            ),
            pageButtons()
          )
  );
}
