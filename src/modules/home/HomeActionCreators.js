import * as ActionTypes from '../../constants/Constants';

//Question fetching
export const fetchListOfQuestions = (pageNo, q) => dispatch => {
  dispatch(questionsLoading());
  return fetch(
    `${ActionTypes.STACK_EXCHANGE_API}search/advanced?key=${
      ActionTypes.STACK_EXCHANGE_API_KEY
    }&pagesize=10&order=desc&sort=votes&filter=withbody&site=stackoverflow&run=true&page=${pageNo}&q=${q}`
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

//Question fetching failed
export const questionsFetchingFailed = errorMessage => ({
  type: ActionTypes.QUESTIONS_LOADING_FAILED,
  payload: errorMessage
});

// If Question fetching success
export const addQuestions = questions => ({
  type: ActionTypes.QUESTIONS_ADD,
  payload: questions
});

// loading data while fetching Question data
export const questionsLoading = () => ({
  type: ActionTypes.QUESTIONS_LOADING,
  payload: null
});

export const defaultState = () => ({
  type: ActionTypes.DEFAULT_STATE,
  payload: null
});
