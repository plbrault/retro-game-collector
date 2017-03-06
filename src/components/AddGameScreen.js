import Autocomplete from 'react-native-autocomplete-input';
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Picker,
  View,
} from 'react-native';

import availableGames from '../data/retroGames.json';
import availablePlatforms from '../data/retroConsoles.json';

const platformsByID = availablePlatforms.reduce((platforms, console) => {
  const platform = {};
  platform[console.platform_id] = console;
  return { ...platforms, ...platform };
}, {});

const PickerItem = Picker.Item;

const styles = StyleSheet.create({
  autocomplete: {
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 25,
    zIndex: 1,
  },
  autocompleteItemText: {
    fontSize: 15,
    margin: 2,
  },
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'space-between',
  },
  infoFields: {
    marginTop: 60,
  },
  summary: {
  },
});

export default class AddGameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableGames,
      title: '',
      platform: platformsByID[0],
      condition: 'L',
      gameSelected: false,
      particularity: '',
    };
  }

  findGame(query) {
    if (query === '') {
      return [];
    }

    const regex = new RegExp(`${query.trim()}`, 'i');
    return this.state.availableGames
      .filter(game => game.title.search(regex) >= 0)
    ;
  }

  render() {
    const titleQuery = this.state.title;
    const games = this.findGame(titleQuery);
    const compareStrings = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.container}>
        <View>
          <Text>Title</Text>
          <Autocomplete
            style={styles.autocomplete}
            containerStyle={styles.autocompleteContainer}
            data={this.state.gameSelected
              || (games.length === 1 && compareStrings(titleQuery, games[0].title)) ? [] : games}
            defaultValue={titleQuery}
            onChangeText={text => this.setState({ title: text, gameSelected: false })}
            onEndEditing={() => this.setState({ gameSelected: true })}
            renderItem={({ title, platform_id }) => (
              <TouchableOpacity
                onPress={
                  () => {
                    this.setState({ title, platform: platformsByID[platform_id] });
                    this.setState({ gameSelected: true });
                  }
                }
              >
                <Text style={styles.autocompleteItemText}>
                  {title} [{platformsByID[platform_id].shortName}]
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.infoFields}>
            <Text>Platform</Text>
            <Picker
              selectedValue={this.state.platform}
              onValueChange={val => this.setState({ platform: val })}
            >
              {
                availablePlatforms.map(platform =>
                  <PickerItem key={platform.platform_id} label={platform.name} value={platform} />,
                )
              }
            </Picker>
            <Text>Condition</Text>
            <Picker
              selectedValue={this.state.condition}
              onValueChange={val => this.setState({ condition: val })}
            >
              <PickerItem label="Loose (L)" value="L" />
              <PickerItem label="Complete in Box (CIB)" value="CIB" />
              <PickerItem label="New in Box (NIB)" value="NIB" />
            </Picker>
            <Text>Particularity</Text>
            <TextInput
              onChangeText={particularity => this.setState({ particularity })}
            />
          </View>
        </View>
        <View style={styles.summary}>
          <Button
            title="Save"
            onPress={
              () => {
                this.setState({ clickedSave: true });
                const { title, condition, particularity } = this.state;
                const platformID = this.state.platform.platform_id;
                this.props.mutate({ variables: { title, platformID, condition, particularity } })
                  .then(() => {
                    this.props.navigation.goBack();
                  });
              }
            }
            disabled={this.state.title.trim() === '' || this.state.clickedSave}
          />
        </View>
      </View>
    );
  }
}
