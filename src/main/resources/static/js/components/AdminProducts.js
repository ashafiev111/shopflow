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

  var _React$useState8 = React.useState(null);
  var editing = _React$useState8[0];
  var setEditing = _React$useState8[1];

  var _React$useState9 = React.useState({ name: '', categoryId: 1, price: '', oldPrice: '', stock: '', rating: '', sold: '' });
  var editForm = _React$useState9[0];
  var setEditForm = _React$useState9[1];

  var _React$useState10 = React.useState(null);
  var editSelectedFile = _React$useState10[0];
  var setEditSelectedFile = _React$useState10[1];

  function loadData() {
    setLoading(true);
    Promise.all([
      fetch('/api/products?size=9999').then(function(r) { return r.json(); }),
      fetch('/api/categories').then(function(r) { return r.json(); })
    ])
    .then(function(_ref) {
      var raw = _ref[0];
      var c = _ref[1];
      setProducts(raw.content || raw);
      setCategories(c);
      setLoading(false);
    })
    .catch(function() { setLoading(false); toast('error', 'Ошибка загрузки'); });
  }

  React.useEffect(loadData, []);

  var filtered = products.filter(function(p) { return p.name.toLowerCase().indexOf(search.toLowerCase()) !== -1; });

  function resetAddForm() {
    setForm({ name: '', categoryId: 1, price: '', stock: '' });
    setSelectedFile(null);
  }

  function handleAdd() {
    if (!form.name || !form.price) { toast('error', 'Заполните все поля'); return; }
    fetchWithAuth('/api/products', {
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
        return fetchWithAuth('/api/products/' + created.id + '/image', { method: 'POST', body: fd }).then(function() { return created; });
      }
      return created;
    })
    .then(function() {
      setShowAdd(false);
      resetAddForm();
      toast('success', 'Товар добавлен');
      loadData();
    })
    .catch(function() { toast('error', 'Ошибка при добавлении'); });
  }

  function handleEdit(p) {
    setEditForm({
      name: p.name,
      categoryId: p.categoryId,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : '',
      stock: String(p.stock),
      rating: String(p.rating),
      sold: String(p.sold)
    });
    setEditSelectedFile(null);
    setEditing(p);
  }

  function handleSaveEdit() {
    if (!editForm.name || !editForm.price) { toast('error', 'Заполните все поля'); return; }
    fetchWithAuth('/api/products/' + editing.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        categoryId: editForm.categoryId,
        price: +editForm.price,
        oldPrice: editForm.oldPrice ? +editForm.oldPrice : null,
        stock: +editForm.stock,
        rating: editForm.rating ? +editForm.rating : 0,
        sold: editForm.sold ? +editForm.sold : 0
      })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Failed to update');
      return r.json();
    })
    .then(function() {
      if (editSelectedFile) {
        var fd = new FormData();
        fd.append('file', editSelectedFile);
        return fetchWithAuth('/api/products/' + editing.id + '/image', { method: 'POST', body: fd });
      }
    })
    .then(function() {
      setEditing(null);
      toast('success', 'Товар обновлён');
      loadData();
    })
    .catch(function() { toast('error', 'Ошибка при обновлении'); });
  }

  function handleDelete(id) {
    if (!confirm('Удалить товар?')) return;
    fetchWithAuth('/api/products/' + id, { method: 'DELETE' })
      .then(function(r) {
        if (!r.ok) throw new Error('Failed to delete');
        toast('success', 'Товар удалён');
        loadData();
      })
      .catch(function() { toast('error', 'Ошибка при удалении'); });
  }

  function catName(id) { var c = categories.find(function(c) { return c.id === id; }); return c ? c.name : ''; }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, 'Загрузка...')
    );
  }

  return React.createElement('div', { className: 'stack' },
    React.createElement('div', { className: 'flex-center gap-3' },
      React.createElement('div', { className: 'search-box', style: { flex: 1 } },
        React.createElement('i', { className: 'ti ti-search' }),
        React.createElement('input', { placeholder: 'Поиск товаров...', value: search, onChange: function(e) { setSearch(e.target.value); } })
      ),
      React.createElement('button', { className: 'btn btn-primary', onClick: function() { setShowAdd(true); } },
        React.createElement('i', { className: 'ti ti-plus' }), ' Добавить товар'
      )
    ),
    React.createElement('div', { className: 'table-wrap' },
      React.createElement('table', null,
        React.createElement('thead', null, React.createElement('tr', null,
          React.createElement('th', null, 'Товар'),
          React.createElement('th', null, 'Категория'),
          React.createElement('th', null, 'Цена'),
          React.createElement('th', null, 'Остаток'),
          React.createElement('th', null, 'Продано'),
          React.createElement('th', null, 'Рейтинг'),
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
              React.createElement('td', { style: { fontWeight: 600 } }, p.price.toLocaleString() + ' ₽'),
              React.createElement('td', null,
                React.createElement('span', { className: 'badge ' + (p.stock <= 5 ? 'badge-danger' : p.stock <= 20 ? 'badge-warning' : 'badge-success') }, p.stock + ' шт.')
              ),
              React.createElement('td', { className: 'text-muted' }, p.sold),
              React.createElement('td', { style: { color: '#f59e0b' } }, '★ ' + p.rating),
              React.createElement('td', null,
                React.createElement('button', { className: 'btn btn-secondary btn-sm', style: { marginRight: 6 }, onClick: function() { handleEdit(p); } },
                  React.createElement('i', { className: 'ti ti-edit' })
                ),
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
          React.createElement('h3', null, 'Новый товар'),
          React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { setShowAdd(false); } }, React.createElement('i', { className: 'ti ti-x' }))
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Название'),
            React.createElement('input', { className: 'form-input', placeholder: 'Название товара', value: form.name, onChange: function(e) { setForm(Object.assign({}, form, { name: e.target.value })); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Категория'),
            React.createElement('select', { className: 'form-input', value: form.categoryId, onChange: function(e) { setForm(Object.assign({}, form, { categoryId: +e.target.value })); } },
              categories.map(function(c) { return React.createElement('option', { key: c.id, value: c.id }, c.name); })
            )
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Изображение'),
            React.createElement('input', { className: 'form-input', type: 'file', accept: 'image/*', onChange: function(e) { setSelectedFile(e.target.files[0] || null); } }),
            selectedFile && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' } }, 'Выбран: ' + selectedFile.name)
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Цена (₽)'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: form.price, onChange: function(e) { setForm(Object.assign({}, form, { price: e.target.value })); } })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Остаток (шт.)'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: form.stock, onChange: function(e) { setForm(Object.assign({}, form, { stock: e.target.value })); } })
            )
          )
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', { className: 'btn btn-secondary', onClick: function() { setShowAdd(false); resetAddForm(); } }, 'Отмена'),
          React.createElement('button', { className: 'btn btn-primary', onClick: handleAdd },
            React.createElement('i', { className: 'ti ti-check' }), ' Добавить'
          )
        )
      )
    ),
    editing && React.createElement('div', { className: 'overlay', onClick: function() { setEditing(null); } },
      React.createElement('div', { className: 'modal', onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, 'Редактировать товар'),
          React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { setEditing(null); } }, React.createElement('i', { className: 'ti ti-x' }))
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Название'),
            React.createElement('input', { className: 'form-input', placeholder: 'Название товара', value: editForm.name, onChange: function(e) { setEditForm(Object.assign({}, editForm, { name: e.target.value })); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Категория'),
            React.createElement('select', { className: 'form-input', value: editForm.categoryId, onChange: function(e) { setEditForm(Object.assign({}, editForm, { categoryId: +e.target.value })); } },
              categories.map(function(c) { return React.createElement('option', { key: c.id, value: c.id }, c.name); })
            )
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Изображение'),
            React.createElement('input', { className: 'form-input', type: 'file', accept: 'image/*', onChange: function(e) { setEditSelectedFile(e.target.files[0] || null); } }),
            editSelectedFile && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' } }, 'Выбран: ' + editSelectedFile.name)
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Цена (₽)'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: editForm.price, onChange: function(e) { setEditForm(Object.assign({}, editForm, { price: e.target.value })); } })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Старая цена (₽)'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: editForm.oldPrice, onChange: function(e) { setEditForm(Object.assign({}, editForm, { oldPrice: e.target.value })); } })
            )
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Остаток (шт.)'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: editForm.stock, onChange: function(e) { setEditForm(Object.assign({}, editForm, { stock: e.target.value })); } })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Продано'),
              React.createElement('input', { className: 'form-input', type: 'number', placeholder: '0', value: editForm.sold, onChange: function(e) { setEditForm(Object.assign({}, editForm, { sold: e.target.value })); } })
            )
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Рейтинг'),
            React.createElement('input', { className: 'form-input', type: 'number', step: '0.1', min: '0', max: '5', placeholder: '0.0', value: editForm.rating, onChange: function(e) { setEditForm(Object.assign({}, editForm, { rating: e.target.value })); } })
          )
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', { className: 'btn btn-secondary', onClick: function() { setEditing(null); } }, 'Отмена'),
          React.createElement('button', { className: 'btn btn-primary', onClick: handleSaveEdit },
            React.createElement('i', { className: 'ti ti-check' }), ' Сохранить'
          )
        )
      )
    )
  );
}
