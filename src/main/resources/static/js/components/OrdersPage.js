function OrdersPage() {
  var _React$useContext = React.useContext(AppCtx);
  var user = _React$useContext.user;
  var navigate = _React$useContext.navigate;

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
    if (!user) { setLoading(false); return; }
    setLoading(true);
    fetchWithAuth('/api/orders')
      .then(function(r) { return r.json(); })
      .then(function(data) { setOrders(data); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, [user]);

  if (!user) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-login' }),
      React.createElement('h3', null, 'Войдите, чтобы увидеть заказы'),
      React.createElement('p', null, 'Зарегистрируйтесь или войдите в аккаунт для отслеживания заказов'),
      React.createElement('div', { className: 'flex-center gap-2', style: { marginTop: 16 } },
        React.createElement('button', { className: 'btn btn-primary', onClick: function() { navigate('login'); } }, 'Войти'),
        React.createElement('button', { className: 'btn btn-secondary', onClick: function() { navigate('register'); } }, 'Регистрация')
      )
    );
  }

  var filtered = activeTab === 'all' ? orders : orders.filter(function(o) { return o.status === activeTab; });

  var steps = ['pending', 'processing', 'shipped', 'delivered'];
  var statusLabels = { pending: 'Принят', processing: 'Обрабатывается', shipped: 'В пути', delivered: 'Доставлен' };

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, 'Загрузка...')
    );
  }

  return React.createElement('div', null,
    filtered.length === 0
      ? React.createElement('div', { className: 'empty' },
          React.createElement('i', { className: 'ti ti-receipt' }),
          React.createElement('h3', null, 'Заказов нет'),
          React.createElement('p', null, 'Здесь появятся ваши заказы после оформления')
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
                  React.createElement('span', { className: 'text-muted text-sm' }, order.items.length + ' ' + (order.items.length === 1 ? 'товар' : 'товара')),
                  React.createElement('span', { className: 'ml-auto font-600' }, order.total.toLocaleString() + ' ₽')
                )
              )
            );
          })
        ),
    selected && React.createElement('div', { className: 'overlay', onClick: function() { setSelected(null); } },
      React.createElement('div', { className: 'modal', onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, 'Заказ ' + selected.id),
          React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { setSelected(null); } }, React.createElement('i', { className: 'ti ti-x' }))
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'flex-center gap-2 mb-4' },
            React.createElement('span', { className: 'badge ' + STATUS_BADGE[selected.status] }, ORDER_STATUS[selected.status]),
            React.createElement('span', { className: 'text-muted text-sm ml-auto' }, selected.date)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('div', { className: 'form-label' }, 'Получатель'),
            React.createElement('div', { style: { fontWeight: 500 } }, selected.customer)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('div', { className: 'form-label' }, 'Телефон'),
            React.createElement('div', null, selected.phone)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('div', { className: 'form-label' }, 'Адрес'),
            React.createElement('div', null, selected.address)
          ),
          React.createElement('div', { className: 'divider' }),
          React.createElement('div', { className: 'form-label', style: { marginBottom: 10 } }, 'Состав заказа'),
          selected.items.map(function(item, i) {
            return React.createElement('div', { key: i, className: 'flex-center gap-2 mb-2' },
              React.createElement('span', { style: { fontSize: 14 } }, item.name),
              item.qty && React.createElement('span', { className: 'badge badge-neutral' }, '×' + item.qty),
              React.createElement('span', { className: 'ml-auto font-600' }, (item.price || item.price).toLocaleString() + ' ₽')
            );
          }),
          React.createElement('div', { className: 'divider' }),
          React.createElement('div', { className: 'flex-center' },
            React.createElement('span', { style: { fontWeight: 600 } }, 'Итого'),
            React.createElement('span', { className: 'ml-auto', style: { fontWeight: 700, fontSize: 18 } }, selected.total.toLocaleString() + ' ₽')
          )
        )
      )
    )
  );
}
