import React from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
  },
  menuItem: {
    margin: 5,
  },
});

export default class HomeScreen extends React.Component {
  static propTypes = {
    navigation: React.PropTypes.object.isRequired,
  }

  static navigationOptions = {
    title: 'Retro Game Collector',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.menuItem}>
          <Button
            onPress={() => navigate('Inventory')}
            title="Inventory"
          />
        </View>
        <View style={styles.menuItem}>
          <Button
            onPress={() => navigate('WishList')}
            title="Wishlist"
          />
        </View>
      </View>
    );
  }
}
