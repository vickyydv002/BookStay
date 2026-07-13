import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import React from 'react';

const SearchBar = props => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a hotel"
        style={styles.input}
        value={props.searchHotel}
        onChangeText={props.setSearchHotel}
      />
      <Pressable onPress={props.handleSearch}>
        <Text>Search</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 32,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
  },
});

export default SearchBar;
