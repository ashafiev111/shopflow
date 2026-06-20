var AppCtx = React.createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      var ex = state.find(function(i) { return i.id === action.product.id; });
      if (ex) return state.map(function(i) { return i.id === action.product.id ? Object.assign({}, i, { qty: i.qty + 1 }) : i; });
      return state.concat([Object.assign({}, action.product, { qty: 1 })]);
    }
    case 'REMOVE': return state.filter(function(i) { return i.id !== action.id; });
    case 'SET_QTY': return state.filter(function(i) { return i.id !== action.id || action.qty > 0; }).map(function(i) { return i.id === action.id ? Object.assign({}, i, { qty: action.qty }) : i; });
    case 'CLEAR': return [];
    default: return state;
  }
}

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'ADD': return state.indexOf(action.id) === -1 ? state.concat([action.id]) : state;
    case 'REMOVE': return state.filter(function(i) { return i !== action.id; });
    case 'LOAD': return action.ids || [];
    default: return state;
  }
}
