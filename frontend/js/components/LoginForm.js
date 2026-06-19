function LoginForm(_ref) {
  var onLogin = _ref.onLogin;
  var onClose = _ref.onClose;

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
    setLoading(true);
    setError('');
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password)
    })
    .then(function(r) {
      if (r.ok) return r.json();
      throw new Error('Invalid credentials');
    })
    .then(function(d) { onLogin(d.username); })
    .catch(function() { setError('\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C'); setLoading(false); });
  }

  return React.createElement('div', { className: 'overlay' },
    React.createElement('div', { className: 'modal', style: { maxWidth: 380 } },
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h3', null, '\u0412\u0445\u043E\u0434 \u0432 \u043F\u0430\u043D\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F'),
        React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: onClose }, React.createElement('i', { className: 'ti ti-x' }))
      ),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { className: 'modal-body' },
          error && React.createElement('div', { style: { padding: '8px 12px', borderRadius: 8, background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: 12, textAlign: 'center', fontSize: 13 } }, error),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u041B\u043E\u0433\u0438\u043D'),
            React.createElement('input', { className: 'form-input', placeholder: 'admin', value: username, onChange: function(e) { setUsername(e.target.value); }, autoFocus: true })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, '\u041F\u0430\u0440\u043E\u043B\u044C'),
            React.createElement('input', { className: 'form-input', type: 'password', placeholder: 'admin', value: password, onChange: function(e) { setPassword(e.target.value); } })
          )
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', { type: 'button', className: 'btn btn-secondary', onClick: onClose }, '\u041E\u0442\u043C\u0435\u043D\u0430'),
          React.createElement('button', { type: 'submit', className: 'btn btn-primary', disabled: loading }, loading ? '\u0412\u0445\u043E\u0434...' : '\u0412\u043E\u0439\u0442\u0438')
        )
      )
    )
  );
}
