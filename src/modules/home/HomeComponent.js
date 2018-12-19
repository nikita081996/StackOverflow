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
  ActivityIndicator,
  NetInfo,
  ToastAndroid,
  AsyncStorage
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
      firstLoading: false,
      isConnected: false
    };
  }

  // check whether the internet connection is available or not, if not then fetch the data from async storage
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    NetInfo.isConnected.fetch().done(isConnected => {
      this.setState({ isConnected });
    });

    setTimeout(() => {
      if (!this.state.isConnected) {
        AsyncStorage.getItem('listOfQuestions')
          .then(res => {
            const parseData = JSON.parse(res);
            if (res !== null) {
              this.setState({ listOfQuestions: parseData });
            }
          })
          .catch(error =>
            ToastAndroid.showWithGravityAndOffset(
              error,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            )
          );
      }
    }, 1000);
  }

  // store the data to the state
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

  // remove the NetInfo connection listener
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange);
    if (this.state.listOfQuestions !== []) {
      AsyncStorage.setItem('listOfQuestions', JSON.stringify(this.state.listOfQuestions)).catch(
        error =>
          ToastAndroid.showWithGravityAndOffset(
            `error${error}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          )
      );
    }
  }

  /**
   * handle whenever netwoek connection changes
   */
  handleConnectivityChange = isConnected => {
    this.setState({
      isConnected
    });
  };

  // when user click the search button reset the state and fetch the data if and only if connection is available
  handleSearchButton() {
    if (this.state.isConnected) {
      this.setState({ listOfQuestions: [] });
      this.setState({ page: 1 });

      this.searchListOfQuestion();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'No Internet Connection',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }

  // call the action creators function to fetch the list of questions from api
  searchListOfQuestion() {
    // if page  is 1 then change the firstLoading state to true
    if (this.state.page === 1 && this.state.firstLoading === false) {
      this.setState({ firstLoading: true });
    }
    Keyboard.dismiss();

    this.props.fetchListOfQuestions(this.state.page, this.state.searchText);
  }

  render() {
    // fetch the data again when list reach at the end of the screen
    const handleLoadMore = () => {
      if (!this.state.loadingMore) this.setState({ loadingMore: true });

      this.setState({ page: this.state.page + 1 }, () => {
        if (this.props.questions.has_more) {
          this.searchListOfQuestion();
        }
      });
    };

    // footer of the flatlist
    const renderFooter = () => {
      if (!this.state.isConnected) {
        if (this.state.loadingMore) this.setState({ loadingMore: false });
      }
      if (
        this.props.errMess !== null ||
        this.props.questions.has_more !== undefined ||
        this.props.questions.has_more === false ||
        !this.state.loadingMore
      ) {
        return (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ alignSelf: 'center' }}>No More Result Found</Text>
          </View>
        );
      }
      return (
        <View style={{ paddingVertical: 5, borderWidth: 1, borderColor: '#CED0CE' }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

    // list of data in flatlist
    const RenderData = data => {
      // if there is  no data then show the loading indicator
      if (data !== null && data.length === 0) {
        if (this.state.firstLoading) {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Loading />
            </View>
          );
        }
      }
      // if data is available then set the firstLoading state to false
      if (this.state.firstLoading) this.setState({ firstLoading: false });

      return (
        <FlatList
          extraData={this.state}
          data={data}
          renderItem={renderUserCard}
          keyExtractor={item => item.question_id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      );
    };

    // card data for each data in list
    const renderUserCard = ({ item, index }) => {
      const connection = this.state.isConnected;
      return (
        <TouchableOpacity
          style={{ marginBottom: 3 }}
          onPress={() => Actions.answerComponent({ item, connection })}
        >
          <Card key={item.question_id} containerStyle={styles.cardWithIcon}>
            <ListItem
              leftAvatar={{
                source: { uri: item.owner.profile_image }
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
    };
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
      </View>
    );
  }
}

// mapping state data to props
const mapStateToProps = state => {
  const { isLoading, errMess, questions } = state.question;
  return { isLoading, errMess, questions };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchListOfQuestions, defaultState }
)(HomeComponent);

const styles = StyleSheet.create({
  mainContainer: {
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
