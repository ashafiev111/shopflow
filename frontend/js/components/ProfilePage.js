function ProfilePage() {
  var _React$useContext = React.useContext(AppCtx);
  var toast = _React$useContext.toast;
  var user = _React$useContext.user;
  var setUser = _React$useContext.setUser;

  var _React$useState = React.useState(null);
  var profile = _React$useState[0];
  var setProfile = _React$useState[1];

  var _React$useState2 = React.useState(true);
  var loading = _React$useState2[0];
  var setLoading = _React$useState2[1];

  var _React$useState3 = React.useState(false);
  var saving = _React$useState3[0];
  var setSaving = _React$useState3[1];

  function loadProfile() {
    setLoading(true);
    fetchWithAuth('/api/users/me')
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function(d) { setProfile(d); setLoading(false); })
      .catch(function() { setLoading(false); toast('error', 'Ошибка загрузки профиля'); });
  }

  React.useEffect(loadProfile, []);

  function handleChange(field, value) {
    setProfile(Object.assign({}, profile, (function() { var o = {}; o[field] = value; return o; })()));
  }

  function handleSave() {
    setSaving(true);
    fetchWithAuth('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profile.email || null,
        fullName: profile.fullName || null,
        phone: profile.phone || null,
        address: profile.address || null
      })
    })
    .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function(d) {
      setProfile(d);
      toast('success', 'Профиль обновлён');
      setSaving(false);
    })
    .catch(function() { toast('error', 'Ошибка сохранения'); setSaving(false); });
  }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, 'Загрузка...')
    );
  }

  if (!profile) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-mood-sad' }),
      React.createElement('h3', null, 'Не удалось загрузить профиль')
    );
  }

  return React.createElement('div', { className: 'profile-page', style: { maxWidth: 600 } },
    React.createElement('div', { className: 'card' },
      React.createElement('div', { className: 'card-header' },
        React.createElement('h2', null, 'Профиль'),
        React.createElement('span', { className: 'badge ' + (profile.role === 'ADMIN' ? 'badge-success' : profile.role === 'MANAGER' ? 'badge-warning' : 'badge-neutral') }, ROLE_LABELS[profile.role] || profile.role)
      ),
      React.createElement('div', { className: 'card-body stack' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Логин'),
          React.createElement('input', { className: 'form-input', value: profile.username, disabled: true })
        ),
        React.createElement('div', { className: 'form-row' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Имя'),
            React.createElement('input', { className: 'form-input', placeholder: 'Имя Фамилия', value: profile.fullName || '', onChange: function(e) { handleChange('fullName', e.target.value); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Email'),
            React.createElement('input', { className: 'form-input', type: 'email', placeholder: 'email@example.com', value: profile.email || '', onChange: function(e) { handleChange('email', e.target.value); } })
          )
        ),
        React.createElement('div', { className: 'form-row' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Телефон'),
            React.createElement('input', { className: 'form-input', placeholder: '+7 (999) 123-45-67', value: profile.phone || '', onChange: function(e) { handleChange('phone', e.target.value); } })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Адрес'),
            React.createElement('input', { className: 'form-input', placeholder: 'г. Москва, ул. Примерная, д. 1', value: profile.address || '', onChange: function(e) { handleChange('address', e.target.value); } })
          )
        ),
        React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
          React.createElement('button', { className: 'btn btn-primary', onClick: handleSave, disabled: saving },
            saving ? 'Сохранение...' : 'Сохранить'
          )
        )
      )
    )
  );
}
