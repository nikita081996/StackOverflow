import * as ActionTypes from '../../constants/Constants';

const INITIAL_STATE = {
  isLoading: false,
  errMess: null,
  questions: []
};

// comment reducers
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.QUESTIONS_ADD:
      console.log('action', action.payload);

      return { ...state, isLoading: false, errMess: null, questions: action.payload };

    case ActionTypes.QUESTIONS_LOADING:
      //console.log(action.payload);
      return { ...state, isLoading: true, errMess: null, questions: [] };

    case ActionTypes.QUESTIONS_LOADING_FAILED:
      console.log('err', action.payload);
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return INITIAL_STATE;
  }
};
