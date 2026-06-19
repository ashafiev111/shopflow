function AdminOrders() {
  var _React$useContext = React.useContext(AppCtx);
  var toast = _React$useContext.toast;

  var _React$useState = React.useState([]);
  var orders = _React$useState[0];
  var setOrders = _React$useState[1];

  var _React$useState2 = React.useState(true);
  var loading = _React$useState2[0];
  var setLoading = _React$useState2[1];

  function loadOrders() {
    setLoading(true);
    fetch('/api/orders')
      .then(function(r) { return r.json(); })
      .then(function(data) { setOrders(data); setLoading(false); })
      .catch(function() { setLoading(false); toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0437\u0430\u043A\u0430\u0437\u043E\u0432'); });
  }

  React.useEffect(loadOrders, []);

  function handleStatusChange(id, status) {
    fetch('/api/orders/' + id + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Failed to update');
      toast('success', '\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430 ' + id + ' \u0438\u0437\u043C\u0435\u043D\u0451\u043D');
      loadOrders();
    })
    .catch(function() { toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F'); });
  }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...')
    );
  }

  return React.createElement('div', { className: 'table-wrap' },
    React.createElement('table', null,
      React.createElement('thead', null, React.createElement('tr', null,
        React.createElement('th', null, '\u0417\u0430\u043A\u0430\u0437'),
        React.createElement('th', null, '\u0414\u0430\u0442\u0430'),
        React.createElement('th', null, '\u041A\u043B\u0438\u0435\u043D\u0442'),
        React.createElement('th', null, '\u0421\u043E\u0441\u0442\u0430\u0432'),
        React.createElement('th', null, '\u0421\u0443\u043C\u043C\u0430'),
        React.createElement('th', null, '\u0421\u0442\u0430\u0442\u0443\u0441'),
        React.createElement('th', null, '\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435')
      )),
      React.createElement('tbody', null,
        orders.map(function(order) {
          return React.createElement('tr', { key: order.id },
            React.createElement('td', { style: { fontWeight: 700 } }, order.id),
            React.createElement('td', { className: 'text-muted' }, order.date),
            React.createElement('td', null, order.customer),
            React.createElement('td', { style: { maxWidth: 200, fontSize: 13, color: 'var(--text-muted)' } },
              order.items.map(function(i) { return i.name; }).join(', ')
            ),
            React.createElement('td', { style: { fontWeight: 600 } }, order.total.toLocaleString() + ' \u20BD'),
            React.createElement('td', null, React.createElement('span', { className: 'badge ' + STATUS_BADGE[order.status] }, ORDER_STATUS[order.status])),
            React.createElement('td', null,
              React.createElement('select', {
                className: 'form-input',
                style: { padding: '5px 8px', fontSize: 13, width: 140 },
                value: order.status,
                onChange: function(e) { handleStatusChange(order.id, e.target.value); }
              },
                Object.entries(ORDER_STATUS).map(function(_ref) {
                  var k = _ref[0];
                  var v = _ref[1];
                  return React.createElement('option', { key: k, value: k }, v);
                })
              )
            )
          );
        })
      )
    )
  );
}
