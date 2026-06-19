function RegisterForm(_ref) {
  var onRegister = _ref.onRegister;
  var onClose = _ref.onClose;

  var _React$useContext = React.useContext(AppCtx);
  var navigate = _React$useContext.navigate;

  var _React$useState = React.useState('');
  var username = _React$useState[0];
  var setUsername = _React$useState[1];

  var _React$useState2 = React.useState('');
  var password = _React$useState2[0];
  var setPassword = _React$useState2[1];

  var _React$useState3 = React.useState('');
  var error = _React$useState3[0];
  var setError = _React$useState3[1];

  var _React$useState4 = React.useState(false);
  var loading = _React$useState4[0];
  var setLoading = _React$useState4[1];

  function handleSubmit(e) {
    e.preventDefault();
    if (username.length < 3) { setError('Логин должен быть минимум 3 символа'); return; }
    if (password.length < 4) { setError('Пароль должен быть минимум 4 символа'); return; }
    setLoading(true);
    setError('');
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    })
    .then(function(r) {
      if (r.ok) return r.json();
      if (r.status === 409) throw new Error('Это имя уже занято');
      throw new Error('Ошибка регистрации');
    })
    .then(function(d) {
      setToken(d.token);
      onRegister(d.username, d.role);
    })
    .catch(function(e) { setError(e.message); setLoading(false); });
  }

  return React.createElement('div', { className: 'overlay' },
    React.createElement('div', { className: 'modal', style: { maxWidth: 380 } },
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h3', null, 'Регистрация'),
        React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: onClose }, React.createElement('i', { className: 'ti ti-x' }))
      ),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { className: 'modal-body' },
          error && React.createElement('div', { style: { padding: '8px 12px', borderRadius: 8, background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: 12, textAlign: 'center', fontSize: 13 } }, error),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Логин'),
            React.createElement('input', { className: 'form-input', placeholder: 'user123', value: username, onChange: function(e) { setUsername(e.target.value); }, autoFocus: true })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Пароль'),
            React.createElement('input', { className: 'form-input', type: 'password', placeholder: 'Создайте пароль', value: password, onChange: function(e) { setPassword(e.target.value); } })
          )
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', { type: 'button', className: 'btn btn-secondary', onClick: function() { onClose(); navigate('login'); } }, 'Уже есть аккаунт?'),
          React.createElement('button', { type: 'submit', className: 'btn btn-primary', disabled: loading }, loading ? 'Регистрация...' : 'Зарегистрироваться')
        )
      )
    )
  );
}
