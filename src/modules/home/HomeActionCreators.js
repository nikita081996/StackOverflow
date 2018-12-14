import * as ActionTypes from '../../constants/Constants';

//comments fetching
export const fetchListOfQuestions = (pageNo, q) => dispatch => {
  dispatch(questionsLoading());
  return fetch(
    `${
      ActionTypes.STACK_EXCHANGE_API
    }search/advanced?pagesize=10&order=desc&sort=relevance&filter=withbody&site=stackoverflow&run=true&page=${pageNo}&q=${q}`
  )
    .then(
      response => {
        if (response.ok) {
          return response;
        }
        const error = new Error(`Error : ${response.status} ${response.statusText}`);
        error.response = response;
        throw error;
      },
      error => {
        const errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then(response => response.json())
    .then(questions => dispatch(addQuestions(questions)))
    .catch(error => dispatch(questionsFetchingFailed(error)));
};

//comment fetching failed
export const questionsFetchingFailed = errorMessage => ({
  type: ActionTypes.QUESTIONS_LOADING_FAILED,
  payload: errorMessage
});

// If comment fetching success
export const addQuestions = questions => ({
  type: ActionTypes.QUESTIONS_ADD,
  payload: questions
});

// loading data while fetching comment data
export const questionsLoading = () => ({
  type: ActionTypes.QUESTIONS_LOADING,
  payload: null
});

export const defaultState = () => ({
  type: ActionTypes.DEFAULT_STATE,
  payload: null
});
