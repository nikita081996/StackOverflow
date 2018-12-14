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
  ActivityIndicator
} from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import Icon from 'react-native-ionicons';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { fetchListOfQuestions, defaultState } from './HomeActionCreators';
import { Loading } from '../../common/LoadingComponent';

let previousData = [];
class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      page: 1,
      listOfQuestions: [],
      loadingMore: false,
      firstLoading: false
    };
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.questions.items !== undefined) {
      if (!nextprops.isLoading) {
        if (this.state.listOfQuestions === []) {
          this.setState({
            listOfQuestions: this.state.listOfQuestions.concat(nextprops.questions.items)
          });
          previousData = nextprops.questions.items;
        } else if (previousData !== nextprops.questions.items) {
          this.setState({
            listOfQuestions: this.state.listOfQuestions.concat(nextprops.questions.items)
          });
          previousData = nextprops.questions.items;
        }
      }
    }
  }

  handleSearchButton() {
    this.setState({ listOfQuestions: [] });
    this.searchListOfQuestion();
  }

  searchListOfQuestion() {
    if (this.state.page === 1 && this.state.firstLoading === false) {
      this.setState({ firstLoading: true });
    }
    Keyboard.dismiss();

    this.props.fetchListOfQuestions(this.state.page, this.state.searchText);
  }

  noResultFound() {
    if (this.props.errMess !== null) {
      if (this.state.firstLoading) {
        this.setState({ firstLoading: false });
        this.setState({ listOfQuestions: [] });
      }
      if (this.state.loadingMore) {
        this.setState({ loadingMore: false });
      }
      return (
        <View>
          <Text style={{ alignSelf: 'center' }}>No Result Found</Text>
        </View>
      );
    }
    return <View />;
  }

  render() {
    const handleLoadMore = () => {
      if (!this.state.loadingMore) this.setState({ loadingMore: true });

      this.setState({ page: this.state.page + 1 }, () => {
        if (!this.props.isLoading) {
          console.log('calling');
          this.searchListOfQuestion();
        }
      });
    };

    const renderFooter = () => {
      if (!this.state.loadingMore) {
        return <View />;
      }
      return (
        <View style={{ paddingVertical: 5, borderWidth: 1, borderColor: '#CED0CE' }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    };
    const RenderData = data => {
      if (data.length === 0) {
        if (this.state.firstLoading) {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Loading />
            </View>
          );
        }
      }

      //  console.log('state', this.state.listOfQuestions);

      if (this.state.firstLoading) this.setState({ firstLoading: false });

      return (
        <FlatList
          data={data}
          renderItem={renderUserCard}
          keyExtractor={item => item.question_id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      );
    };

    const renderUserCard = ({ item, index }) => (
      //  console.log(item.owner.profile_image);
      <TouchableOpacity
        style={{ marginBottom: 3 }}
        onPress={() => Actions.answerComponent({ item })}
      >
        <Card key={item.question_id} containerStyle={styles.cardWithIcon}>
          <ListItem
            leftAvatar={{
              source: { uri: item.owner.profile_image }

              // icon: { uri: item.owner.profile_image }

              // title: item.owner.display_name
            }}
            title={item.owner.display_name}
          />
          <View style={styles.cardElementStyle}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 14 }}>{item.score} Votes</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
    // inside your render function
    return (
      <View style={{ marginBottom: 100 }}>
        <KeyboardAvoidingView behavior="padding">
          <View style={{ marginTop: 55, flexDirection: 'row' }}>
            <View style={styles.mainContainer}>
              <TextInput
                placeholder="Type here. . ."
                placeholderTextColor="#ffffff"
                underlineColorAndroid="transparent"
                style={styles.textInputStyleClass}
                onChangeText={text => this.setState({ searchText: text })}
              />
            </View>
            <TouchableOpacity
              style={{ alignSelf: 'center', padding: 5 }}
              onPress={() => this.handleSearchButton()}
            >
              <Icon name="search" size={30} color="#000000" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {RenderData(this.state.listOfQuestions)}
        {/* {this.noResultFound()} */}
      </View>
    );
  }
}

// mapping state data to props
const mapStateToProps = state => {
  const { isLoading, errMess, questions } = state.question;
  // console.log(state.question.questions);
  return { isLoading, errMess, questions };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchListOfQuestions, defaultState }
)(HomeComponent);

const styles = StyleSheet.create({
  mainContainer: {
    // Setting up View inside content in Vertically center.
    width: '87%',
    padding: 4
  },

  textInputStyleClass: {
    textAlign: 'center',
    color: '#ffffff',
    height: 45,
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: 'grey'
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
