function CartPage(_ref) {
  var _React$useContext = React.useContext(AppCtx);
  var cart = _React$useContext.cart;
  var dispatch = _React$useContext.dispatch;
  var toast = _React$useContext.toast;
  var navigate = _React$useContext.navigate;
  var user = _React$useContext.user;

  var _React$useState = React.useState(false);
  var showCheckout = _React$useState[0];
  var setShowCheckout = _React$useState[1];

  var _React$useState2 = React.useState({ name: 'Иван Петров', phone: '+7 (999) 123-45-67', address: 'Москва, ул. Ленина, 12, кв. 34', comment: '' });
  var form = _React$useState2[0];
  var setForm = _React$useState2[1];

  var _React$useState3 = React.useState(false);
  var submitting = _React$useState3[0];
  var setSubmitting = _React$useState3[1];

  var total = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  var totalQty = cart.reduce(function(s, i) { return s + i.qty; }, 0);

  function handleOrder() {
    setSubmitting(true);
    var items = cart.map(function(i) { return { productId: i.id, qty: i.qty }; });
    var opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form.name,
        phone: form.phone,
        address: form.address,
        comment: form.comment,
        items: items
      })
    };
    (user ? fetchWithAuth('/api/orders', opts) : fetch('/api/orders', opts))
    .then(function(r) {
      if (!r.ok) throw new Error('Order failed');
      return r.json();
    })
    .then(function() {
      dispatch({ type: 'CLEAR' });
      setShowCheckout(false);
      setSubmitting(false);
      toast('success', '\u0417\u0430\u043A\u0430\u0437 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D!');
      navigate('orders');
    })
    .catch(function() {
      setSubmitting(false);
      toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0438 \u0437\u0430\u043A\u0430\u0437\u0430');
    });
  }

  if (cart.length === 0) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-shopping-cart' }),
      React.createElement('h3', null, '\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430'),
      React.createElement('p', null, '\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0442\u043E\u0432\u0430\u0440\u044B \u0438\u0437 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430'),
      React.createElement('button', { className: 'btn btn-primary', style: { marginTop: 16 }, onClick: function() { navigate('catalog'); } },
        React.createElement('i', { className: 'ti ti-arrow-left' }), ' \u0412 \u043A\u0430\u0442\u0430\u043B\u043E\u0433'
      )
    );
  }

  return React.createElement('div', { className: 'grid-2', style: { alignItems: 'start', gap: 24 } },
    React.createElement('div', null,
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-header' },
          React.createElement('h2', null, '\u041A\u043E\u0440\u0437\u0438\u043D\u0430'),
          React.createElement('span', { className: 'text-muted' }, totalQty + ' ' + (totalQty === 1 ? '\u0442\u043E\u0432\u0430\u0440' : totalQty < 5 ? '\u0442\u043E\u0432\u0430\u0440\u0430' : '\u0442\u043E\u0432\u0430\u0440\u043E\u0432'))
        ),
        React.createElement('div', { className: 'card-body', style: { padding: '0 20px' } },
          cart.map(function(item) {
            return React.createElement('div', { key: item.id, className: 'cart-item' },
              React.createElement('div', { className: 'cart-item-img' }, item.imageUrl ? React.createElement('img', { src: item.imageUrl, alt: item.name }) : React.createElement('i', { className: 'ti ti-photo', style: { fontSize: 20, color: 'var(--text-hint)' } })),
              React.createElement('div', { className: 'cart-item-info' },
                React.createElement('div', { className: 'cart-item-name' }, item.name),
                React.createElement('div', { className: 'cart-item-price' }, item.price.toLocaleString() + ' \u20BD / \u0448\u0442.')
              ),
              React.createElement('div', { className: 'qty-ctrl' },
                React.createElement('button', { className: 'qty-btn', onClick: function() { dispatch({ type: 'SET_QTY', id: item.id, qty: item.qty - 1 }); } }, '\u2212'),
                React.createElement('span', { className: 'qty-num' }, item.qty),
                React.createElement('button', { className: 'qty-btn', onClick: function() { dispatch({ type: 'SET_QTY', id: item.id, qty: item.qty + 1 }); } }, '+')
              ),
              React.createElement('div', { style: { fontWeight: 600, minWidth: 80, textAlign: 'right' } }, (item.price * item.qty).toLocaleString() + ' \u20BD'),
              React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { dispatch({ type: 'REMOVE', id: item.id }); } },
                React.createElement('i', { className: 'ti ti-trash', style: { fontSize: 16, color: 'var(--danger)' } })
              )
            );
          })
        )
      )
    ),
    React.createElement('div', { className: 'stack' },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'flex-center gap-2 mb-4' },
            React.createElement('span', { className: 'text-muted' }, '\u0418\u0442\u043E\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u043E\u0432:'),
            React.createElement('span', { className: 'ml-auto' }, totalQty + ' \u0448\u0442.')
          ),
          React.createElement('div', { className: 'flex-center gap-2', style: { marginBottom: 16 } },
            React.createElement('span', { style: { fontWeight: 600 } }, '\u0421\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u0430:'),
            React.createElement('span', { className: 'ml-auto', style: { fontWeight: 700, fontSize: 20 } }, total.toLocaleString() + ' \u20BD')
          ),
          React.createElement('div', { className: 'divider' }),
          React.createElement('button', {
            className: 'btn btn-primary',
            style: { width: '100%', justifyContent: 'center', padding: 12 },
            onClick: function() { setShowCheckout(true); },
            disabled: submitting
          },
            React.createElement('i', { className: 'ti ti-credit-card' }), ' \u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437'
          ),
          React.createElement('button', { className: 'btn btn-ghost', style: { width: '100%', justifyContent: 'center', marginTop: 8 }, onClick: function() { navigate('catalog'); } },
            '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043F\u043E\u043A\u0443\u043F\u043A\u0438'
          )
        )
      ),
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'flex-center gap-2 mb-3' },
            React.createElement('i', { className: 'ti ti-shield-check', style: { color: 'var(--success)', fontSize: 18 } }),
            React.createElement('span', { style: { fontSize: 13, fontWeight: 600 } }, '\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u043E\u043F\u043B\u0430\u0442\u0430')
          ),
          React.createElement('div', { className: 'flex-center gap-2 mb-3' },
            React.createElement('i', { className: 'ti ti-truck', style: { color: 'var(--accent)', fontSize: 18 } }),
            React.createElement('span', { style: { fontSize: 13 } }, '\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430 1\u20133 \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u0434\u043D\u044F')
          ),
          React.createElement('div', { className: 'flex-center gap-2' },
            React.createElement('i', { className: 'ti ti-refresh', style: { color: 'var(--warning)', fontSize: 18 } }),
            React.createElement('span', { style: { fontSize: 13 } }, '\u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 14 \u0434\u043D\u0435\u0439')
          )
        )
      )
    ),
    showCheckout && React.createElement('div', { className: 'overlay', onClick: function() { if (!submitting) setShowCheckout(false); } },
      React.createElement('div', { className: 'modal', onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, '\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430'),
          React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { if (!submitting) setShowCheckout(false); } }, React.createElement('i', { className: 'ti ti-x' }))
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u0418\u043C\u044F'),
            React.createElement('input', { className: 'form-input', value: form.name, onChange: function(e) { setForm(Object.assign({}, form, { name: e.target.value })); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u0422\u0435\u043B\u0435\u0444\u043E\u043D'),
            React.createElement('input', { className: 'form-input', value: form.phone, onChange: function(e) { setForm(Object.assign({}, form, { phone: e.target.value })); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u0410\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438'),
            React.createElement('input', { className: 'form-input', value: form.address, onChange: function(e) { setForm(Object.assign({}, form, { address: e.target.value })); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u0437\u0430\u043A\u0430\u0437\u0443'),
            React.createElement('textarea', { className: 'form-input', rows: 3, value: form.comment, onChange: function(e) { setForm(Object.assign({}, form, { comment: e.target.value })); }, placeholder: '\u0414\u043E\u043C\u043E\u0444\u043E\u043D, \u043F\u043E\u0436\u0435\u043B\u0430\u043D\u0438\u044F...' })
          ),
          React.createElement('div', { className: 'divider' }),
          React.createElement('div', { className: 'flex-center gap-2' },
            React.createElement('span', { className: 'text-muted' }, '\u0418\u0442\u043E\u0433\u043E:'),
            React.createElement('span', { className: 'ml-auto', style: { fontWeight: 700, fontSize: 18 } }, total.toLocaleString() + ' \u20BD')
          )
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', { className: 'btn btn-secondary', onClick: function() { if (!submitting) setShowCheckout(false); } }, '\u041E\u0442\u043C\u0435\u043D\u0430'),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: handleOrder,
            disabled: submitting
          },
            React.createElement('i', { className: 'ti ti-check' }), submitting ? ' \u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435...' : ' \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437'
          )
        )
      )
    )
  );
}
