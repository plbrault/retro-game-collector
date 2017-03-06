import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import {
  AppRegistry,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import update from 'immutability-helper';

import AddGameScreen from './components/AddGameScreen';
import HomeScreen from './components/HomeScreen';
import GameListScreen from './components/GameListScreen';
import settings from './settings.json';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: settings.graphqlEndpoint,
  }),
  dataIdFromObject: o => o.id,
});

const InventoryQuery = gql`
  query allOwnedGames {
    allOwnedGames(orderBy: title_ASC) {
       id
       title
       platformID
       condition
       particularity
    }
  }
`;

const WishListQuery = gql`
  query allWantedGames {
    allWantedGames(orderBy: title_ASC) {
       id
       title
       platformID
       particularity
    }
  }
`;

const AddOwnedGameMutation = gql`
  mutation createOwnedGame($title: String!, $platformID: Int!, $condition: OWNED_GAME_CONDITION!, $particularity: String!) {
    createOwnedGame(title: $title, platformID: $platformID, condition: $condition, particularity: $particularity) {
      id
      title
      platformID
      condition
      particularity
    }
  }
`;

const AddWantedGameMutation = gql`
  mutation createWantedGame($title: String!, $platformID: Int!, $particularity: String!) {
    createWantedGame(title: $title, platformID: $platformID, particularity: $particularity) {
      id
      title
      platformID
      particularity
    }
  }
`;

const AddGameToInventoryScreen = graphql(AddOwnedGameMutation, {
  props({ ownProps, mutate }) {
    return {
      mutate({ variables }) {
        return mutate({
          variables: { ...variables },
          updateQueries: {
            allOwnedGames: (prev, { mutationResult }) => {
              const newOwnedGame = mutationResult.data.createOwnedGame;
              return update(prev, {
                allOwnedGames: {
                  $push: [newOwnedGame],
                },
              });
            },
          },
        });
      },
    };
  },
})(AddGameScreen);

const AddGameToWishListScreen = graphql(AddWantedGameMutation, {
  props({ ownProps, mutate }) {
    return {
      mutate({ variables }) {
        return mutate({
          variables: { ...variables },
          updateQueries: {
            allWantedGames: (prev, { mutationResult }) => {
              const newWantedGame = mutationResult.data.createWantedGame;
              return update(prev, {
                allWantedGames: {
                  $push: [newWantedGame],
                },
              });
            },
          },
        });
      },
    };
  },
})(AddGameScreen);

const InventoryScreen = ({ navigation, data }) => <GameListScreen navigation={navigation} data={data} addRoute="AddGameToInventory" queryName="allOwnedGames" mode="owned" />;
const WishListScreen = ({ navigation, data }) => <GameListScreen navigation={navigation} data={data} addRoute="AddGameToWishList" queryName="allWantedGames" mode="wanted" />;

const AppNavigator = StackNavigator({
  AddGameToInventory: { screen: AddGameToInventoryScreen, navigationOptions: { title: 'Add Game to Inventory' } },
  AddGameToWishList: { screen: AddGameToWishListScreen, navigationOptions: { title: 'Add Game to WishList' } },
  Home: { screen: HomeScreen },
  Inventory: { screen: graphql(InventoryQuery)(InventoryScreen), navigationOptions: { title: 'Inventory' } },
  WishList: { screen: graphql(WishListQuery)(WishListScreen), navigationOptions: { title: 'Wish List' } },
}, { initialRouteName: 'Home' });

const RetroGameCollector = () => (
  <ApolloProvider client={client}>
    <AppNavigator />
  </ApolloProvider>
);

AppRegistry.registerComponent('RetroGameCollector', () => RetroGameCollector);
