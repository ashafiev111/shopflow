var AppCtx = React.createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      var ex = state.find(function(i) { return i.id === action.product.id; });
      if (ex) return state.map(function(i) { return i.id === action.product.id ? Object.assign({}, i, { qty: i.qty + 1 }) : i; });
      return state.concat([Object.assign({}, action.product, { qty: 1 })]);
    }
    case 'REMOVE': return state.filter(function(i) { return i.id !== action.id; });
    case 'SET_QTY': return state.map(function(i) { return i.id === action.id ? Object.assign({}, i, { qty: Math.max(1, action.qty) }) : i; });
    case 'CLEAR': return [];
    default: return state;
  }
}
