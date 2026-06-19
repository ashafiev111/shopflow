function AdminCats() {
  var _React$useContext = React.useContext(AppCtx);
  var toast = _React$useContext.toast;

  var _React$useState = React.useState([]);
  var cats = _React$useState[0];
  var setCats = _React$useState[1];

  var _React$useState2 = React.useState({ name: '', icon: '\u{1F4E6}' });
  var form = _React$useState2[0];
  var setForm = _React$useState2[1];

  var _React$useState3 = React.useState(false);
  var showAdd = _React$useState3[0];
  var setShowAdd = _React$useState3[1];

  var _React$useState4 = React.useState(true);
  var loading = _React$useState4[0];
  var setLoading = _React$useState4[1];

  function loadCats() {
    setLoading(true);
    fetch('/api/categories')
      .then(function(r) { return r.json(); })
      .then(function(data) { setCats(data); setLoading(false); })
      .catch(function() { setLoading(false); toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438'); });
  }

  React.useEffect(loadCats, []);

  function handleAdd() {
    if (!form.name) return;
    fetchWithAuth('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, icon: form.icon })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Failed to create');
      return r.json();
    })
    .then(function() {
      setShowAdd(false);
      setForm({ name: '', icon: '\u{1F4E6}' });
      toast('success', '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430');
      loadCats();
    })
    .catch(function() { toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438'); });
  }

  function handleDelete(id) {
    fetchWithAuth('/api/categories/' + id, { method: 'DELETE' })
      .then(function(r) {
        if (!r.ok) throw new Error('Failed to delete');
        toast('success', '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u0443\u0434\u0430\u043B\u0435\u043D\u0430');
        loadCats();
      })
      .catch(function() { toast('error', '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438'); });
  }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...')
    );
  }

  return React.createElement('div', { className: 'stack' },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end' } },
      React.createElement('button', { className: 'btn btn-primary', onClick: function() { setShowAdd(true); } },
        React.createElement('i', { className: 'ti ti-plus' }), ' \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E'
      )
    ),
    React.createElement('div', { className: 'grid-3' },
      cats.map(function(cat) {
        return React.createElement('div', { key: cat.id, className: 'card' },
          React.createElement('div', { className: 'card-body', style: { display: 'flex', alignItems: 'center', gap: 16 } },
            React.createElement('div', { style: { fontSize: 36 } }, cat.icon),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontWeight: 600, marginBottom: 2 } }, cat.name),
              React.createElement('div', { className: 'text-muted text-sm' }, '0 \u0442\u043E\u0432\u0430\u0440\u043E\u0432')
            ),
            React.createElement('button', {
              className: 'btn btn-danger btn-sm btn-icon',
              onClick: function() { handleDelete(cat.id); }
            }, React.createElement('i', { className: 'ti ti-trash' }))
          )
        );
      })
    ),
    showAdd && React.createElement('div', { className: 'overlay', onClick: function() { setShowAdd(false); } },
      React.createElement('div', { className: 'modal', onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, '\u041D\u043E\u0432\u0430\u044F \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F'),
          React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { setShowAdd(false); } }, React.createElement('i', { className: 'ti ti-x' }))
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'),
            React.createElement('input', { className: 'form-input', placeholder: '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438', value: form.name, onChange: function(e) { setForm(Object.assign({}, form, { name: e.target.value })); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u0418\u043A\u043E\u043D\u043A\u0430 (\u044D\u043C\u043E\u0434\u0437\u0438)'),
            React.createElement('input', { className: 'form-input', value: form.icon, onChange: function(e) { setForm(Object.assign({}, form, { icon: e.target.value })); } })
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
