function AdminUsers() {
  var _React$useContext = React.useContext(AppCtx);
  var toast = _React$useContext.toast;

  var _React$useState = React.useState([]);
  var users = _React$useState[0];
  var setUsers = _React$useState[1];

  var _React$useState2 = React.useState(true);
  var loading = _React$useState2[0];
  var setLoading = _React$useState2[1];

  function loadUsers() {
    setLoading(true);
    fetchWithAuth('/api/users')
      .then(function(r) { return r.json(); })
      .then(function(data) { setUsers(data); setLoading(false); })
      .catch(function() { setLoading(false); toast('error', 'Ошибка загрузки пользователей'); });
  }

  React.useEffect(loadUsers, []);

  function handleRoleChange(id, newRole) {
    fetchWithAuth('/api/users/' + id + '/role', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Failed');
      return r.json();
    })
    .then(function() {
      toast('success', 'Роль изменена');
      loadUsers();
    })
    .catch(function() { toast('error', 'Ошибка при смене роли'); });
  }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, 'Загрузка...')
    );
  }

  return React.createElement('div', { className: 'table-wrap' },
    React.createElement('table', null,
      React.createElement('thead', null, React.createElement('tr', null,
        React.createElement('th', null, 'ID'),
        React.createElement('th', null, 'Логин'),
        React.createElement('th', null, 'Роль'),
        React.createElement('th', null, 'Действие')
      )),
      React.createElement('tbody', null,
        users.map(function(u) {
          return React.createElement('tr', { key: u.id },
            React.createElement('td', { style: { fontWeight: 700 } }, u.id),
            React.createElement('td', null, u.username),
            React.createElement('td', null,
              React.createElement('span', { className: 'badge ' + (u.role === 'ADMIN' ? 'badge-success' : u.role === 'MANAGER' ? 'badge-warning' : 'badge-neutral') },
                ROLE_LABELS[u.role] || u.role
              )
            ),
            React.createElement('td', null,
              React.createElement('select', {
                className: 'form-input',
                style: { padding: '5px 8px', fontSize: 13, width: 160 },
                value: u.role,
                onChange: function(e) { handleRoleChange(u.id, e.target.value); }
              },
                Object.keys(ROLE_LABELS).map(function(k) {
                  return React.createElement('option', { key: k, value: k }, ROLE_LABELS[k]);
                })
              )
            )
          );
        })
      )
    )
  );
}
