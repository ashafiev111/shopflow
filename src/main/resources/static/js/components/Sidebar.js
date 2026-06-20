function Sidebar(_ref) {
  var page = _ref.page;
  var cartCount = _ref.cartCount;
  var user = _ref.user;
  var setUser = _ref.setUser;
  var _React$useContext = React.useContext(AppCtx);
  var navigate = _React$useContext.navigate;

  function handleLogout() {
    setToken(null);
    setUser(null);
    navigate('catalog');
  }

  return React.createElement('nav', { className: 'sidebar' },
    React.createElement('div', { className: 'sidebar-logo', style: { cursor: 'pointer' }, onClick: function() { navigate('catalog'); } },
      React.createElement('h1', null, 'ShopFlow'),
      React.createElement('span', null, 'Интернет-магазин')
    ),
    React.createElement('div', { className: 'sidebar-nav' },
      MENU.map(function(item, i) {
        if (item.section) {
          return React.createElement('div', { key: i, className: 'sidebar-section' }, item.section);
        }
        if (item.roles && (!user || item.roles.indexOf(user.role) === -1)) {
          return null;
        }
        if (item.auth && !user) {
          return null;
        }
        return React.createElement('button', {
          key: item.id,
          className: 'nav-item ' + (page === item.id ? 'active' : ''),
          onClick: function() { navigate(item.id); }
        },
          React.createElement('i', { className: 'ti ' + item.icon }),
          React.createElement('span', null, item.label),
          item.badge && cartCount > 0 && React.createElement('span', { className: 'nav-badge' }, cartCount)
        );
      })
    ),
    React.createElement('div', { style: { padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' } },
      user
        ? React.createElement('div', { className: 'flex-center gap-2' },
            React.createElement('div', { className: 'avatar', style: { cursor: 'pointer' }, onClick: function() { navigate('profile'); } }, user.username.charAt(0).toUpperCase()),
            React.createElement('div', { style: { flex: 1, cursor: 'pointer' }, onClick: function() { navigate('profile'); } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#fff' } }, user.username),
              React.createElement('div', { style: { fontSize: 11, color: ROLE_COLORS[user.role] || 'rgba(255,255,255,0.4)' } }, ROLE_LABELS[user.role] || user.role)
            ),
            React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: handleLogout, style: { color: 'rgba(255,255,255,0.5)' } },
              React.createElement('i', { className: 'ti ti-logout' })
            )
          )
        : React.createElement('div', { className: 'flex-center gap-2' },
            React.createElement('button', {
              className: 'btn btn-secondary btn-sm',
              style: { flex: 1, justifyContent: 'center', fontSize: 12 },
              onClick: function() { navigate('login'); }
            }, 'Войти'),
            React.createElement('button', {
              className: 'btn btn-primary btn-sm',
              style: { flex: 1, justifyContent: 'center', fontSize: 12 },
              onClick: function() { navigate('register'); }
            }, 'Регистрация')
          )
    )
  );
}
