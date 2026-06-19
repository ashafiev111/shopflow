function Toasts(_ref) {
  var toasts = _ref.toasts;
  return React.createElement('div', { className: 'toast-container' },
    toasts.map(function(t) {
      return React.createElement('div', { key: t.id, className: 'toast toast-' + t.type },
        React.createElement('i', { className: 'ti ' + (t.type === 'success' ? 'ti-circle-check' : 'ti-alert-circle') }),
        t.msg
      );
    })
  );
}
