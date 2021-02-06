const initialState = {
  message: null,
};

function errorReducer(state = initialState, action = {}) {
  // otherwise return the existing state unchanged
  if (action.error) {
    return {
      ...state,
      message: action.error,
    };
  }
  return state;
}
export default errorReducer;
