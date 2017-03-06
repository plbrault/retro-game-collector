import React from 'react';
import {
  Button,
  ListView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import retroConsoles from '../data/retroConsoles.json';

const platformsByID = retroConsoles.reduce((platforms, console) => {
  const platform = {};
  platform[console.platform_id] = console;
  return { ...platforms, ...platform };
}, {});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  list: {
  },
  summary: {
  },
});

export default class GameListScreen extends React.Component {
  static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
      Trainer: React.PropTypes.object,
    }).isRequired,
    navigation: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: ({ title1, platformID1 }, { title2, platformID2 }) =>
        title1 !== title2 || platformID1 !== platformID2,
    });

    this.state = {
      dataSource,
    };
  }

  render() {
    if (this.props.data.loading) {
      return (<Text style={{ marginTop: 64 }}>Loading</Text>);
    }

    if (this.props.data.error) {
      return (<Text style={{ marginTop: 64 }}>An unexpected error occurred</Text>);
    }

    const dataSource = this.state.dataSource.cloneWithRows(this.props.data[this.props.queryName]);
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          dataSource={dataSource}
          renderRow={rowData =>
            <Text>
              {rowData.title}
              {rowData.particularity && rowData.particularity !== ''
                ? ` (${rowData.particularity}) `
                : ' '}
              [{platformsByID[rowData.platformID].shortName}]
            </Text>
          }
        />
        <View style={styles.summary}>
          <Text>{`${dataSource.getRowCount()} games in inventory.`}</Text>
          <Button
            title="Add a game"
            onPress={() => navigate(this.props.addRoute)}
          />
        </View>
      </View>
    );
  }
}
