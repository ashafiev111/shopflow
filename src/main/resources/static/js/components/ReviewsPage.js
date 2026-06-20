function ReviewsPage(_ref) {
  var page = _ref.page;
  var setPage = _ref.setPage;

  var productId = React.useMemo(function() { return parseInt(page.replace('reviews-', ''), 10) || 0; }, [page]);

  var _React$useContext = React.useContext(AppCtx);
  var toast = _React$useContext.toast;
  var user = _React$useContext.user;
  var navigate = _React$useContext.navigate;

  var _React$useState = React.useState(null);
  var product = _React$useState[0];
  var setProduct = _React$useState[1];

  var _React$useState2 = React.useState([]);
  var reviews = _React$useState2[0];
  var setReviews = _React$useState2[1];

  var _React$useState3 = React.useState(true);
  var loading = _React$useState3[0];
  var setLoading = _React$useState3[1];

  var _React$useState4 = React.useState(5);
  var newRating = _React$useState4[0];
  var setNewRating = _React$useState4[1];

  var _React$useState5 = React.useState('');
  var newComment = _React$useState5[0];
  var setNewComment = _React$useState5[1];

  var _React$useState6 = React.useState(false);
  var submitting = _React$useState6[0];
  var setSubmitting = _React$useState6[1];

  function loadData() {
    setLoading(true);
    Promise.all([
      fetch('/api/products/' + productId).then(function(r) { return r.ok ? r.json() : Promise.reject(); }),
      fetch('/api/products/' + productId + '/reviews').then(function(r) { return r.json().then(function(d) { return Array.isArray(d) ? d : []; }); })
    ])
    .then(function(_ref2) {
      var p = _ref2[0];
      var r = _ref2[1];
      setProduct(p);
      setReviews(r);
      setLoading(false);
    })
    .catch(function() { setLoading(false); });
  }

  React.useEffect(loadData, [productId]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!user) { toast('error', 'Авторизуйтесь, чтобы оставить отзыв'); return; }
    if (newRating < 1 || newRating > 5) { toast('error', 'Оценка от 1 до 5'); return; }
    setSubmitting(true);
    fetchWithAuth('/api/products/' + productId + '/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: newRating, comment: newComment })
    })
    .then(function(r) {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then(function() {
      toast('success', 'Отзыв добавлен');
      setNewRating(5);
      setNewComment('');
      setSubmitting(false);
      loadData();
    })
    .catch(function() { toast('error', 'Ошибка при добавлении отзыва'); setSubmitting(false); });
  }

  function handleDelete(reviewId) {
    fetchWithAuth('/api/reviews/' + reviewId, { method: 'DELETE' })
      .then(function(r) {
        if (!r.ok) throw new Error();
        toast('success', 'Отзыв удалён');
        loadData();
      })
      .catch(function() { toast('error', 'Ошибка при удалении'); });
  }

  function stars(n) {
    return '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);
  }

  if (loading) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-loader' }),
      React.createElement('h3', null, 'Загрузка...')
    );
  }

  if (!product) {
    return React.createElement('div', { className: 'empty' },
      React.createElement('i', { className: 'ti ti-mood-sad' }),
      React.createElement('h3', null, 'Товар не найден'),
      React.createElement('button', { className: 'btn btn-primary', style: { marginTop: 16 }, onClick: function() { navigate('catalog'); } },
        React.createElement('i', { className: 'ti ti-arrow-left' }), ' В каталог'
      )
    );
  }

  return React.createElement('div', null,
    React.createElement('div', { style: { marginBottom: 20 } },
      React.createElement('button', { className: 'btn btn-ghost', onClick: function() { navigate('product-' + productId); } },
        React.createElement('i', { className: 'ti ti-arrow-left' }), ' Назад к товару'
      )
    ),
    React.createElement('h2', { style: { marginBottom: 8 } }, 'Отзывы на «' + product.name + '»'),
    React.createElement('div', { className: 'flex-center gap-2', style: { marginBottom: 24 } },
      React.createElement('span', { style: { color: '#f59e0b', fontSize: 18 } }, '\u2605'.repeat(Math.floor(product.rating))),
      React.createElement('span', { className: 'text-muted' }, product.rating + ' (' + reviews.length + ' отзывов)')
    ),

    user && React.createElement('div', { className: 'card', style: { marginBottom: 24 } },
      React.createElement('div', { className: 'card-header' },
        React.createElement('h2', null, 'Написать отзыв')
      ),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { className: 'card-body stack' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Оценка'),
            React.createElement('div', { className: 'flex-center gap-1', style: { fontSize: 22, cursor: 'pointer', color: '#f59e0b' } },
              [1,2,3,4,5].map(function(n) {
                return React.createElement('span', {
                  key: n,
                  onClick: function() { setNewRating(n); },
                  style: { opacity: n <= newRating ? 1 : 0.3 }
                }, '\u2605');
              })
            )
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { className: 'form-label' }, 'Комментарий'),
            React.createElement('textarea', { className: 'form-input', rows: 3, placeholder: 'Ваше мнение о товаре...', value: newComment, onChange: function(e) { setNewComment(e.target.value); } })
          ),
          React.createElement('button', { type: 'submit', className: 'btn btn-primary', disabled: submitting },
            submitting ? 'Отправка...' : 'Оставить отзыв'
          )
        )
      )
    ),

    reviews.length === 0
      ? React.createElement('div', { className: 'empty' },
          React.createElement('i', { className: 'ti ti-message' }),
          React.createElement('h3', null, 'Отзывов пока нет'),
          React.createElement('p', null, 'Будьте первым, кто оставит отзыв')
        )
      : React.createElement('div', { className: 'stack' },
          reviews.map(function(r) {
            var canDelete = user && (user.username === r.username || user.role === 'ADMIN');
            return React.createElement('div', { key: r.id, className: 'card' },
              React.createElement('div', { className: 'card-body' },
                React.createElement('div', { className: 'flex-center gap-3', style: { marginBottom: 8 } },
                  React.createElement('div', { className: 'avatar' }, r.username.charAt(0).toUpperCase()),
                  React.createElement('div', { style: { flex: 1 } },
                    React.createElement('div', { style: { fontSize: 14, fontWeight: 600 } }, r.username),
                    React.createElement('div', { style: { fontSize: 12, color: '#f59e0b' } }, stars(r.rating))
                  ),
                  React.createElement('span', { className: 'text-sm text-muted' }, r.createdAt ? r.createdAt.substring(0, 10) : ''),
                  canDelete && React.createElement('button', { className: 'btn btn-ghost btn-icon', onClick: function() { handleDelete(r.id); } },
                    React.createElement('i', { className: 'ti ti-trash', style: { color: 'var(--danger)' } })
                  )
                ),
                r.comment && React.createElement('p', { style: { fontSize: 14, lineHeight: 1.5 } }, r.comment)
              )
            );
          })
        )
  );
}
