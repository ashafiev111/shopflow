function Sidebar(_ref) {
  var page = _ref.page;
  var setPage = _ref.setPage;
  var cartCount = _ref.cartCount;
  var user = _ref.user;
  var setUser = _ref.setUser;

  function handleLogout() {
    fetch('/api/auth/logout', { method: 'POST' }).then(function() {
      setUser(null);
      setPage('catalog');
    });
  }

  return React.createElement('nav', { className: 'sidebar' },
    React.createElement('div', { className: 'sidebar-logo' },
      React.createElement('h1', null, 'ShopFlow'),
      React.createElement('span', null, '\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D')
    ),
    React.createElement('div', { className: 'sidebar-nav' },
      MENU.map(function(item, i) {
        if (item.section) {
          return React.createElement('div', { key: i, className: 'sidebar-section' }, item.section);
        }
        if (item.admin && !user) {
          return null;
        }
        return React.createElement('button', {
          key: item.id,
          className: 'nav-item ' + (page === item.id ? 'active' : ''),
          onClick: function() { setPage(item.id); }
        },
          React.createElement('i', { className: 'ti ' + item.icon }),
          React.createElement('span', null, item.label),
          item.badge && cartCount > 0 && React.createElement('span', { className: 'nav-badge' }, cartCount)
        );
      })
    ),
    React.createElement('div', { style: { padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' } },
      user
        ? React.createElement('div', { className: 'flex-center gap-2' },
            React.createElement('div', { className: 'avatar' }, 'A'),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#fff' } }, user.username),
              React.createElement('div', { style: { fontSize: 11, color: 'rgba(255,255,255,0.4)' } }, '\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440')
            ),
            React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: handleLogout, style: { color: 'rgba(255,255,255,0.5)' } },
              React.createElement('i', { className: 'ti ti-logout' })
            )
          )
        : React.createElement('button', {
            className: 'nav-item',
            onClick: function() { var p = page.startsWith('admin') ? page : 'admin'; setPage(p); }
          },
            React.createElement('i', { className: 'ti ti-login' }),
            React.createElement('span', null, '\u0412\u043E\u0439\u0442\u0438 \u0432 \u0430\u0434\u043C\u0438\u043D\u043A\u0443')
          )
    )
  );
}
