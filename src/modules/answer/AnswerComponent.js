import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Dimensions,
  ActivityIndicator,
  Image,
  ScrollView
} from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Loading } from '../../common/LoadingComponent';
import { fetchListOfAnswers } from './AnswerActionCreators';

let previousData = [];
class AnswerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      listOfAnswers: [],
      page: 1,
      loadingMore: false,
      firstLoading: false
    };
  }

  // fetch list of answer when component mount
  componentWillMount() {
    this.fetchListOfAnswer();
  }

  // store the data to the state
  componentWillReceiveProps(nextprops) {
    if (nextprops.answers.items !== undefined) {
      if (!nextprops.isLoading) {
        if (this.state.listOfAnswers === []) {
          this.setState({
            listOfAnswers: this.state.listOfAnswers.concat(nextprops.answers.items)
          });
          previousData = nextprops.answers.items;
        } else if (previousData !== nextprops.answers.items) {
          this.setState({
            listOfAnswers: this.state.listOfAnswers.concat(nextprops.answers.items)
          });
          previousData = nextprops.answers.items;
        }
      }
    }
  }

  // call the action creators function to fetch the list of answers from api
  fetchListOfAnswer() {
    if (this.state.page === 1 && this.state.firstLoading === false) {
      this.setState({ firstLoading: true });
    }
    this.props.fetchListOfAnswers(this.props.item.question_id, this.state.page);
  }

  // replace '\n' with <br/> tag
  replaceNewLinewithHtmlTag(body) {
    const a = body.replace(new RegExp('\n\n', 'g'), '\n');
    const b = a.replace(new RegExp('<ul>\n', 'g'), '<ul>');
    const c = b.replace(new RegExp('</li>\n', 'g'), '</li>');
    const d = c.replace(new RegExp('\n', 'g'), '<br>');
    return d;
  }

  render() {
    const { title, body, score } = this.props.item;
    const { display_name } = this.props.item.owner;
    const modifiedBody = this.replaceNewLinewithHtmlTag(body);

    // fetch the data again when list reach at the end of the screen
    const handleLoadMore = () => {
      if (!this.state.loadingMore) this.setState({ loadingMore: true });

      this.setState({ page: this.state.page + 1 }, () => {
        if (this.props.answers.has_more) this.fetchListOfAnswer();
      });
    };

    // footer of the flatlist
    const renderFooter = () => {
      if (
        this.props.errMess !== null ||
        this.props.answers.has_more !== undefined ||
        this.props.answers.has_more === false
      ) {
        if (this.state.firstLoading) {
          this.setState({ firstLoading: false });
          // this.setState({ listOfQuestions: [] });
        }
        if (this.state.loadingMore) {
          this.setState({ loadingMore: false });
        }
        return (
          <View>
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

    // header of the flatlist
    const renderHeader = () => (
      <View>
        <View>
          <View style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
            <Text>
              {display_name}, {score} Votes
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        </View>
        <HTML
          html={modifiedBody}
          imagesMaxWidth={Dimensions.get('window').width}
          renderers={{
            code: (x, k) => <Text style={{ color: 'black', fontWeight: 'bold' }}>{k}</Text>
          }}
        />
      </View>
    );

    // list of data in flatlist
    const RenderData = data => {
      // if there is  no data then show the loading indicator
      if (data.length === 0) {
        if (!this.props.answers.has_more) {
          return (
            <ScrollView>
              <View>
                <View style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                  <Text>
                    {display_name}, {score} Votes
                  </Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
              </View>
              <HTML
                html={modifiedBody}
                imagesMaxWidth={Dimensions.get('window').width}
                renderers={{
                  code: (x, k) => <Text style={{ color: 'black', fontWeight: 'bold' }}>{k}</Text>
                }}
              />
              {/* {this.noResultFound()} */}
            </ScrollView>
          );
        } else if (this.state.firstLoading) {
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
          data={data}
          renderItem={renderUserCard}
          keyExtractor={item => item.answer_id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderHeader}
        />
      );
    };

    // card data for each data in list
    const renderUserCard = ({ item, index }) => {
      const modifiedAnswerBody = this.replaceNewLinewithHtmlTag(item.body);
      return (
        <TouchableOpacity style={{ marginBottom: 3 }}>
          <Card key={item.answer_id} containerStyle={styles.cardWithIcon}>
            <ListItem
              leftAvatar={{
                source: { uri: item.owner.profile_image }
              }}
              title={item.owner.display_name}
            />
            <View style={styles.cardElementStyle}>
              <HTML
                html={modifiedAnswerBody}
                imagesMaxWidth={Dimensions.get('window').width}
                renderers={{
                  code: (x, k) => (
                    <Text style={{ color: 'black', fontWeight: 'bold', fontStyle: 'italic' }}>
                      {k}
                    </Text>
                  ),
                  img: (x, k) => (
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={{
                        uri: k
                      }}
                    />
                  )
                }}
              />
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ fontSize: 14 }}>{item.score} Votes</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ marginTop: 50, padding: 5, flex: 1 }}>
        {RenderData(this.state.listOfAnswers)}
      </View>
    );
  }
}

// mapping state data to props
const mapStateToProps = state => {
  const { isLoading, errMess, answers } = state.answer;
  return { isLoading, errMess, answers };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchListOfAnswers }
)(AnswerComponent);

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
