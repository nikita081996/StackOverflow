import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
  Text,
  WebView,
  ScrollView,
  Dimensions
} from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-ionicons';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Loading } from '../../common/LoadingComponent';
import { fetchListOfAnswers } from './AnswerActionCreators';

class AnswerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    };
  }

  componentWillMount() {
    this.props.fetchListOfAnswers(this.props.item.question_id);
  }
  render() {
    const { title, body, score } = this.props.item;
    const { display_name } = this.props.item.owner;
    // console.log(this.props.item.question_id);
    const a = body.replace(new RegExp('\n\n', 'g'), '\n');

    const b = a.replace(new RegExp('<ul>\n', 'g'), '<ul>');
    const c = b.replace(new RegExp('</li>\n', 'g'), '</li>');
    const d = c.replace(new RegExp('\n', 'g'), '<br>');

    // const s = body.replace('<ul>/\n', '<ul>');

    // const d = s.replace('</li>/\n', '</li>');
    //  const e = d.replace('/\n', '<br>')
    return (
      <ScrollView style={{ marginTop: 50, padding: 5, flex: 1 }}>
        <View>
          <View style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
            <Text>
              {display_name}, {score} Votes
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        </View>
        <HTML
          // html={d.replace(new RegExp('\n', 'g'), '<br>')}
          html={d}
          imagesMaxWidth={Dimensions.get('window').width}
          renderers={{
            //p: () => <View style={{ width: '100%', height: 10, backgroundColor: 'blue' }} />

            code: (x, k) => <Text style={{ color: 'black', fontWeight: 'bold' }}>{k}</Text>
          }}
        />
      </ScrollView>

      // <WebView style={{ marginTop: 50, padding: 5 }} html={body} />
    );
  }
}

// mapping state data to props
const mapStateToProps = state => {
  const { isLoading, errMess, answers } = state.answer;
  console.log(state.answer.answers.items);
  return { isLoading, errMess, answers };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchListOfAnswers }
)(AnswerComponent);
