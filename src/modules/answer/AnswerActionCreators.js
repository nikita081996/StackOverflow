import * as ActionTypes from '../../constants/Constants';

//Answer fetching
export const fetchListOfAnswers = (question_id, pageNo) => dispatch => {
  dispatch(answersLoading());
  return fetch(
    `${
      ActionTypes.STACK_EXCHANGE_API
    }questions/${question_id}/answers?order=desc&page=${pageNo}&pagesize=2&sort=activity&site=stackoverflow&filter=withbody`
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
    .then(answers => dispatch(addAnswers(answers)))
    .catch(error => dispatch(answersFetchingFailed(error)));
};

//Answer fetching failed
export const answersFetchingFailed = errorMessage => ({
  type: ActionTypes.ANSWERS_LOADING_FAILED,
  payload: errorMessage
});

// If Answer fetching success
export const addAnswers = answers => ({
  type: ActionTypes.ANSWERS_ADD,
  payload: answers
});

// loading data while fetching Answer data
export const answersLoading = () => ({
  type: ActionTypes.ANSWERS_LOADING,
  payload: null
});
