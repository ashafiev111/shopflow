function AdminDashboard() {
  var _React$useState = React.useState([]);
  var orders = _React$useState[0];
  var setOrders = _React$useState[1];

  var _React$useState2 = React.useState([]);
  var products = _React$useState2[0];
  var setProducts = _React$useState2[1];

  var _React$useState3 = React.useState([]);
  var categories = _React$useState3[0];
  var setCategories = _React$useState3[1];

  var _React$useState4 = React.useState(true);
  var loading = _React$useState4[0];
  var setLoading = _React$useState4[1];

  React.useEffect(function() {
    Promise.all([
      fetchWithAuth('/api/orders').then(function(r) { return r.json(); }),
      fetch('/api/products?size=9999').then(function(r) { return r.json(); }),
      fetch('/api/categories').then(function(r) { return r.json(); })
    ])
    .then(function(_ref) {
      var o = _ref[0];
      var p = _ref[1];
      var c = _ref[2];
      setOrders(o);
      setProducts(p.content || p);
      setCategories(c);
      setLoading(false);
    })
    .catch(function() { setLoading(false); });
  }, []);

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...')
    );
  }

  var revenue = orders.reduce(function(s, o) { return s + o.total; }, 0);
  var today = orders.filter(function(o) { return o.date === new Date().toLocaleDateString('ru-RU'); }).length;

  var stats = [
    { label: '\u0412\u044B\u0440\u0443\u0447\u043A\u0430', icon: 'ti-currency-ruble', value: revenue.toLocaleString() + ' \u20BD', change: orders.length + ' \u0437\u0430\u043A\u0430\u0437\u043E\u0432', up: true },
    { label: '\u0417\u0430\u043A\u0430\u0437\u043E\u0432 \u0432\u0441\u0435\u0433\u043E', icon: 'ti-receipt', value: orders.length, change: today + ' \u0441\u0435\u0433\u043E\u0434\u043D\u044F', up: true },
    { label: '\u0422\u043E\u0432\u0430\u0440\u043E\u0432', icon: 'ti-package', value: products.length, change: categories.length + ' \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439', up: null },
    { label: '\u041A\u043B\u0438\u0435\u043D\u0442\u043E\u0432', icon: 'ti-users', value: 1247, change: '+8 \u0437\u0430 \u043D\u0435\u0434\u0435\u043B\u044E', up: true },
  ];

  var topProducts = products.slice().sort(function(a,b) { return b.sold - a.sold; }).slice(0, 5);

  return React.createElement('div', { className: 'stack' },
    React.createElement('div', { className: 'grid-4' },
      stats.map(function(s, i) {
        return React.createElement('div', { key: i, className: 'stat-card' },
          React.createElement('div', { className: 'stat-label' }, React.createElement('i', { className: 'ti ' + s.icon }), s.label),
          React.createElement('div', { className: 'stat-value' }, s.value),
          s.change && React.createElement('div', { className: 'stat-change ' + (s.up === true ? 'up' : s.up === false ? 'down' : '') },
            (s.up === true ? '\u2191 ' : '') + (s.up === false ? '\u2193 ' : '') + s.change
          )
        );
      })
    ),
    React.createElement('div', { className: 'grid-2', style: { gap: 20 } },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, '\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0442\u043E\u0432\u0430\u0440\u044B')),
        React.createElement('div', { className: 'card-body', style: { padding: 0 } },
          React.createElement('table', null,
            React.createElement('thead', null, React.createElement('tr', null,
              React.createElement('th', null, '\u0422\u043E\u0432\u0430\u0440'),
              React.createElement('th', null, '\u041F\u0440\u043E\u0434\u0430\u043D\u043E'),
              React.createElement('th', null, '\u0412\u044B\u0440\u0443\u0447\u043A\u0430')
            )),
            React.createElement('tbody', null,
              topProducts.map(function(p) {
                return React.createElement('tr', { key: p.id },
                  React.createElement('td', null, p.imageUrl ? React.createElement('img', { src: p.imageUrl, alt: p.name, style: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover', marginRight: 8, verticalAlign: 'middle' } }) : React.createElement('i', { className: 'ti ti-photo', style: { fontSize: 18, marginRight: 8, color: 'var(--text-hint)', verticalAlign: 'middle' } }), p.name),
                  React.createElement('td', null, React.createElement('span', { className: 'badge badge-info' }, p.sold)),
                  React.createElement('td', { style: { fontWeight: 600 } }, (p.price * p.sold / 1000).toFixed(0) + 'K \u20BD')
                );
              })
            )
          )
        )
      ),
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, '\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u044B')),
        React.createElement('div', { className: 'card-body', style: { padding: 0 } },
          React.createElement('table', null,
            React.createElement('thead', null, React.createElement('tr', null,
              React.createElement('th', null, '\u0417\u0430\u043A\u0430\u0437'),
              React.createElement('th', null, '\u0421\u0443\u043C\u043C\u0430'),
              React.createElement('th', null, '\u0421\u0442\u0430\u0442\u0443\u0441')
            )),
            React.createElement('tbody', null,
              orders.slice().reverse().slice(0, 5).map(function(o) {
                return React.createElement('tr', { key: o.id },
                  React.createElement('td', { style: { fontSize: 13 } },
                    React.createElement('div', { style: { fontWeight: 600 } }, o.id),
                    React.createElement('div', { className: 'text-muted', style: { fontSize: 11 } }, o.date)
                  ),
                  React.createElement('td', { style: { fontWeight: 600 } }, o.total.toLocaleString() + ' \u20BD'),
                  React.createElement('td', null, React.createElement('span', { className: 'badge ' + STATUS_BADGE[o.status] }, ORDER_STATUS[o.status]))
                );
              }),
              orders.length === 0 && React.createElement('tr', null,
                React.createElement('td', { colSpan: 3, style: { textAlign: 'center', color: 'var(--text-hint)', padding: 24 } }, '\u0417\u0430\u043A\u0430\u0437\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442')
              )
            )
          )
        )
      )
    ),
    React.createElement('div', { className: 'card' },
      React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u043F\u043E \u043F\u0440\u043E\u0434\u0430\u0436\u0430\u043C')),
      React.createElement('div', { className: 'card-body' },
        categories.map(function(cat) {
          var catProds = products.filter(function(p) { return p.categoryId === cat.id; });
          var catSold = catProds.reduce(function(s, p) { return s + p.sold; }, 0);
          var maxSold = Math.max.apply(null, categories.map(function(c) {
            return products.filter(function(p) { return p.categoryId === c.id; }).reduce(function(s, p) { return s + p.sold; }, 0);
          }));
          return React.createElement('div', { key: cat.id, style: { marginBottom: 14 } },
            React.createElement('div', { className: 'flex-center gap-2 mb-1' },
              React.createElement('span', { style: { fontSize: 14 } }, cat.icon + ' ' + cat.name),
              React.createElement('span', { className: 'ml-auto text-muted text-sm' }, catSold + ' \u043F\u0440\u043E\u0434\u0430\u0436')
            ),
            React.createElement('div', { className: 'progress' },
              React.createElement('div', { className: 'progress-bar', style: { width: maxSold > 0 ? (catSold / maxSold) * 100 + '%' : '0%' } })
            )
          );
        })
      )
    )
  );
}
