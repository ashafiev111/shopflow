function OrdersPage() {
  var _React$useState = React.useState(null);
  var selected = _React$useState[0];
  var setSelected = _React$useState[1];

  var _React$useState2 = React.useState('all');
  var activeTab = _React$useState2[0];
  var setActiveTab = _React$useState2[1];

  var _React$useState3 = React.useState([]);
  var orders = _React$useState3[0];
  var setOrders = _React$useState3[1];

  var _React$useState4 = React.useState(true);
  var loading = _React$useState4[0];
  var setLoading = _React$useState4[1];

  React.useEffect(function() {
    setLoading(true);
    fetch('/api/orders')
      .then(function(r) { return r.json(); })
      .then(function(data) { setOrders(data); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, []);

  var filtered = activeTab === 'all' ? orders : orders.filter(function(o) { return o.status === activeTab; });

  var steps = ['pending', 'processing', 'shipped', 'delivered'];
  var statusLabels = { pending: '\u041F\u0440\u0438\u043D\u044F\u0442', processing: '\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F', shipped: '\u0412 \u043F\u0443\u0442\u0438', delivered: '\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D' };

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...')
    );
  }

  return React.createElement('div', null,
    React.createElement('div', { className: 'tabs' },
      [['all', '\u0412\u0441\u0435'], ['pending', '\u041E\u0436\u0438\u0434\u0430\u0435\u0442'], ['processing', '\u0412 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435'], ['shipped', '\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D'], ['delivered', '\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D']].map(function(_ref) {
        var val = _ref[0];
        var label = _ref[1];
        return React.createElement('div', { key: val, className: 'tab ' + (activeTab === val ? 'active' : ''), onClick: function() { setActiveTab(val); } }, label);
      })
    ),
    filtered.length === 0
      ? React.createElement('div', { className: 'empty' },
          React.createElement('i', { className: 'ti ti-receipt' }),
          React.createElement('h3', null, '\u0417\u0430\u043A\u0430\u0437\u043E\u0432 \u043D\u0435\u0442'),
          React.createElement('p', null, '\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0432\u0430\u0448\u0438 \u0437\u0430\u043A\u0430\u0437\u044B \u043F\u043E\u0441\u043B\u0435 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F')
        )
      : React.createElement('div', { className: 'stack' },
          filtered.map(function(order) {
            return React.createElement('div', { key: order.id, className: 'card', style: { cursor: 'pointer' }, onClick: function() { setSelected(order); } },
              React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'flex-center gap-3 mb-3' },
                  React.createElement('span', { style: { fontWeight: 700, fontSize: 15 } }, order.id),
                  React.createElement('span', { className: 'text-muted text-sm' }, order.date),
                  React.createElement('span', { className: 'badge ' + STATUS_BADGE[order.status] + ' ml-auto' }, ORDER_STATUS[order.status])
                ),
                React.createElement('div', { className: 'text-sm text-muted mb-3' },
                  order.items.map(function(i) { return i.name; }).join(', ')
                ),
                order.status !== 'cancelled' && React.createElement('div', { className: 'order-steps' },
                  steps.map(function(s, idx) {
                    var curIdx = steps.indexOf(order.status);
                    var isDone = idx < curIdx;
                    var isActive = idx === curIdx;
                    return React.createElement('div', { key: s, className: 'flex-center' },
                      React.createElement('div', { className: 'step ' + (isDone ? 'done' : '') + (isActive ? ' active' : '') },
                        React.createElement('div', { className: 'step-dot' }),
                        React.createElement('span', { style: { fontSize: 11, color: isDone ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--text-hint)' } }, statusLabels[s])
                      ),
                      idx < steps.length - 1 && React.createElement('div', { className: 'step-line ' + (isDone ? 'done' : ''), style: { marginLeft: 6, marginRight: 6 } })
                    );
                  })
                ),
                React.createElement('div', { className: 'flex-center', style: { marginTop: 12 } },
                  React.createElement('span', { className: 'text-muted text-sm' }, order.items.length + ' ' + (order.items.length === 1 ? '\u0442\u043E\u0432\u0430\u0440' : '\u0442\u043E\u0432\u0430\u0440\u0430')),
                  React.createElement('span', { className: 'ml-auto font-600' }, order.total.toLocaleString() + ' \u20BD')
                )
              )
            );
          })
        ),
    selected && React.createElement('div', { className: 'overlay', onClick: function() { setSelected(null); } },
      React.createElement('div', { className: 'modal', onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, '\u0417\u0430\u043A\u0430\u0437 ' + selected.id),
          React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { setSelected(null); } }, React.createElement('i', { className: 'ti ti-x' }))
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'flex-center gap-2 mb-4' },
            React.createElement('span', { className: 'badge ' + STATUS_BADGE[selected.status] }, ORDER_STATUS[selected.status]),
            React.createElement('span', { className: 'text-muted text-sm ml-auto' }, selected.date)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('div', { className: 'form-label' }, '\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C'),
            React.createElement('div', { style: { fontWeight: 500 } }, selected.customer)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('div', { className: 'form-label' }, '\u0422\u0435\u043B\u0435\u0444\u043E\u043D'),
            React.createElement('div', null, selected.phone)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('div', { className: 'form-label' }, '\u0410\u0434\u0440\u0435\u0441'),
            React.createElement('div', null, selected.address)
          ),
          React.createElement('div', { className: 'divider' }),
          React.createElement('div', { className: 'form-label', style: { marginBottom: 10 } }, '\u0421\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0430\u0437\u0430'),
          selected.items.map(function(item, i) {
            return React.createElement('div', { key: i, className: 'flex-center gap-2 mb-2' },
              React.createElement('span', { style: { fontSize: 14 } }, item.name),
              item.qty && React.createElement('span', { className: 'badge badge-neutral' }, '\u00D7' + item.qty),
              React.createElement('span', { className: 'ml-auto font-600' }, (item.price || item.price).toLocaleString() + ' \u20BD')
            );
          }),
          React.createElement('div', { className: 'divider' }),
          React.createElement('div', { className: 'flex-center' },
            React.createElement('span', { style: { fontWeight: 600 } }, '\u0418\u0442\u043E\u0433\u043E'),
            React.createElement('span', { className: 'ml-auto', style: { fontWeight: 700, fontSize: 18 } }, selected.total.toLocaleString() + ' \u20BD')
          )
        )
      )
    )
  );
}
