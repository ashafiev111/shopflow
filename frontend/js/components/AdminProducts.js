function AdminProducts() {
  var _React$useContext = React.useContext(AppCtx);
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

  var _React$useState5 = React.useState(false);
  var showAdd = _React$useState5[0];
  var setShowAdd = _React$useState5[1];

  var _React$useState6 = React.useState({ name: '', categoryId: 1, price: '', stock: '' });
  var form = _React$useState6[0];
  var setForm = _React$useState6[1];

  var _React$useState7 = React.useState(null);
  var selectedFile = _React$useState7[0];
  var setSelectedFile = _React$useState7[1];

  function loadData() {
    setLoading(true);
    Promise.all([
      fetch('/api/products').then(function(r) { return r.json(); }),
      fetch('/api/categories').then(function(r) { return r.json(); })
    ])
    .then(function(_ref) {
      var p = _ref[0];
      var c = _ref[1];
      setProducts(p);
      setCategories(c);
      setLoading(false);
    })
    .catch(function() { setLoading(false); toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438'); });
  }

  React.useEffect(loadData, []);

  var filtered = products.filter(function(p) { return p.name.toLowerCase().indexOf(search.toLowerCase()) !== -1; });

  function handleAdd() {
    if (!form.name || !form.price) { toast('error', '\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0432\u0441\u0435 \u043F\u043E\u043B\u044F'); return; }
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        categoryId: form.categoryId,
        price: +form.price,
        stock: +form.stock
      })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Failed to create');
      return r.json();
    })
    .then(function(created) {
      if (selectedFile) {
        var fd = new FormData();
        fd.append('file', selectedFile);
        return fetch('/api/products/' + created.id + '/image', { method: 'POST', body: fd }).then(function() { return created; });
      }
      return created;
    })
    .then(function() {
      setShowAdd(false);
      setSelectedFile(null);
      setForm({ name: '', categoryId: 1, price: '', stock: '' });
      toast('success', '\u0422\u043E\u0432\u0430\u0440 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D');
      loadData();
    })
    .catch(function() { toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438'); });
  }

  function handleDelete(id) {
    fetch('/api/products/' + id, { method: 'DELETE' })
      .then(function(r) {
        if (!r.ok) throw new Error('Failed to delete');
        toast('success', '\u0422\u043E\u0432\u0430\u0440 \u0443\u0434\u0430\u043B\u0451\u043D');
        loadData();
      })
      .catch(function() { toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438'); });
  }

  function catName(id) { var c = categories.find(function(c) { return c.id === id; }); return c ? c.name : ''; }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...')
    );
  }

  return React.createElement('div', { className: 'stack' },
    React.createElement('div', { className: 'flex-center gap-3' },
      React.createElement('div', { className: 'search-box', style: { flex: 1 } },
        React.createElement('i', { className: 'ti ti-search' }),
        React.createElement('input', { placeholder: '\u041F\u043E\u0438\u0441\u043A \u0442\u043E\u0432\u0430\u0440\u043E\u0432...', value: search, onChange: function(e) { setSearch(e.target.value); } })
      ),
      React.createElement('button', { className: 'btn btn-primary', onClick: function() { setShowAdd(true); } },
        React.createElement('i', { className: 'ti ti-plus' }), ' \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440'
      )
    ),
    React.createElement('div', { className: 'table-wrap' },
      React.createElement('table', null,
        React.createElement('thead', null, React.createElement('tr', null,
          React.createElement('th', null, '\u0422\u043E\u0432\u0430\u0440'),
          React.createElement('th', null, '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F'),
          React.createElement('th', null, '\u0426\u0435\u043D\u0430'),
          React.createElement('th', null, '\u041E\u0441\u0442\u0430\u0442\u043E\u043A'),
          React.createElement('th', null, '\u041F\u0440\u043E\u0434\u0430\u043D\u043E'),
          React.createElement('th', null, '\u0420\u0435\u0439\u0442\u0438\u043D\u0433'),
          React.createElement('th', null)
        )),
        React.createElement('tbody', null,
          filtered.map(function(p) {
            return React.createElement('tr', { key: p.id },
              React.createElement('td', null,
                p.imageUrl
                  ? React.createElement('img', { src: p.imageUrl, alt: p.name, style: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover', marginRight: 10, verticalAlign: 'middle' } })
                  : React.createElement('i', { className: 'ti ti-photo', style: { fontSize: 20, marginRight: 10, color: 'var(--text-hint)', verticalAlign: 'middle' } }),
                React.createElement('span', { style: { fontWeight: 500 } }, p.name)
              ),
              React.createElement('td', null, React.createElement('span', { className: 'badge badge-neutral' }, catName(p.categoryId))),
              React.createElement('td', { style: { fontWeight: 600 } }, p.price.toLocaleString() + ' \u20BD'),
              React.createElement('td', null,
                React.createElement('span', { className: 'badge ' + (p.stock <= 5 ? 'badge-danger' : p.stock <= 20 ? 'badge-warning' : 'badge-success') }, p.stock + ' \u0448\u0442.')
              ),
              React.createElement('td', { className: 'text-muted' }, p.sold),
              React.createElement('td', { style: { color: '#f59e0b' } }, '\u2605 ' + p.rating),
              React.createElement('td', null,
                React.createElement('button', { className: 'btn btn-danger btn-sm', onClick: function() { handleDelete(p.id); } },
                  React.createElement('i', { className: 'ti ti-trash' })
                )
              )
            );
          })
        )
      )
    ),
    showAdd && React.createElement('div', { className: 'overlay', onClick: function() { setShowAdd(false); } },
      React.createElement('div', { className: 'modal', onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, '\u041D\u043E\u0432\u044B\u0439 \u0442\u043E\u0432\u0430\u0440'),
          React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { setShowAdd(false); } }, React.createElement('i', { className: 'ti ti-x' }))
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'),
            React.createElement('input', { className: 'form-input', placeholder: '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0442\u043E\u0432\u0430\u0440\u0430', value: form.name, onChange: function(e) { setForm(Object.assign({}, form, { name: e.target.value })); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F'),
            React.createElement('select', { className: 'form-input', value: form.categoryId, onChange: function(e) { setForm(Object.assign({}, form, { categoryId: +e.target.value })); } },
              categories.map(function(c) { return React.createElement('option', { key: c.id, value: c.id }, c.name); })
            )
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435'),
            React.createElement('input', { className: 'form-input', type: 'file', accept: 'image/*', onChange: function(e) { setSelectedFile(e.target.files[0] || null); } }),
            selectedFile && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' } }, '\u0412\u044B\u0431\u0440\u0430\u043D: ' + selectedFile.name)
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, '\u0426\u0435\u043D\u0430 (\u20BD)'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: form.price, onChange: function(e) { setForm(Object.assign({}, form, { price: e.target.value })); } })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, '\u041E\u0441\u0442\u0430\u0442\u043E\u043A (\u0448\u0442.)'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: form.stock, onChange: function(e) { setForm(Object.assign({}, form, { stock: e.target.value })); } })
            )
          )
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', { className: 'btn btn-secondary', onClick: function() { setShowAdd(false); } }, '\u041E\u0442\u043C\u0435\u043D\u0430'),
          React.createElement('button', { className: 'btn btn-primary', onClick: handleAdd },
            React.createElement('i', { className: 'ti ti-check' }), ' \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C'
          )
        )
      )
    )
  );
}
