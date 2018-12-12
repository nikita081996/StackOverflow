import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
  Text,
  ScrollView
} from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-ionicons';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { fetchListOfQuestions } from './HomeActionCreators';
import { Loading } from '../../common/LoadingComponent';

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    };
  }

  searchListOfQuestion() {
    //console.log('ser');
    Keyboard.dismiss();
    this.props.fetchListOfQuestions(1, this.state.searchText);
  }

  render() {
    const RenderData = data => {
      if (data != null) {
        // if data is loading
        if (this.props.isLoading) {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Loading />
            </View>
          );
        }
        // show list of comment data
        return (
          <FlatList
            data={data.items}
            renderItem={renderUserCard}
            keyExtractor={item => item.question_id.toString()}
          />
        );
      }
    };

    const renderUserCard = ({ item, index }) => (
      <TouchableOpacity
        style={{ marginBottom: 3 }}
        onPress={() => Actions.answerComponent({ item })}
      >
        <Card key={item.question_id} containerStyle={styles.cardWithIcon}>
          <View style={styles.cardElementStyle}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 14 }}>{item.score} Votes</Text>
              <Text style={{ fontSize: 14 }}>{item.owner.display_name}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
    // inside your render function
    return (
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View style={{ marginTop: 50, flexDirection: 'row' }}>
            <View style={styles.mainContainer}>
              <TextInput
                placeholder="Type here. . ."
                underlineColorAndroid="transparent"
                style={styles.textInputStyleClass}
                onChangeText={text => this.setState({ searchText: text })}
              />
            </View>
            <TouchableOpacity
              style={{ alignSelf: 'center', padding: 5 }}
              onPress={() => this.searchListOfQuestion()}
            >
              <Icon name="search" size={30} color="#FF5722" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {RenderData(this.props.questions)}
      </ScrollView>
    );
  }
}

// mapping state data to props
const mapStateToProps = state => {
  const { isLoading, errMess, questions } = state.question;
  // console.log(state.question.questions.items);
  return { isLoading, errMess, questions };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchListOfQuestions }
)(HomeComponent);

const styles = StyleSheet.create({
  mainContainer: {
    // Setting up View inside content in Vertically center.
    width: '87%',
    padding: 4
  },

  textInputStyleClass: {
    textAlign: 'center',
    height: 50,
    borderWidth: 2,
    borderColor: '#FF5722',
    borderRadius: 10,
    backgroundColor: '#FFFFFF'
  },
  cardWithIcon: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: 8,
    elevation: 5
  },
  cardElementStyle: {
    flexDirection: 'column'
  }
});
