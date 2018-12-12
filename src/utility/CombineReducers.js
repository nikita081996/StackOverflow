import { combineReducers } from 'redux';
import HomeReducers from '../modules/home/HomeReducers';
import AnswerReducers from '../modules/answer/AnswerReducers';

// Combine all reducers
export default combineReducers({
  question: HomeReducers,
  answer: AnswerReducers
});
