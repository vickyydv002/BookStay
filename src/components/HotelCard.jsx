import {View, Text, StyleSheet, ImageBackground, Pressable} from 'react-native';
import React from 'react';

const HotelCard = ({data, onPress}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <ImageBackground
        source={{uri: data.hotel_images[0]}}
        style={styles.imageBackground}>
        <View style={styles.overlay}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.location} numberOfLines={1}>
            {data.location}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{data.ratings}</Text>
            <Text style={styles.ratingText}> from </Text>
            <Text style={styles.ratingText}>{data.reviews}</Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    overflow: 'hidden',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    padding: 10,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  location: {
    fontSize: 16,
    color: 'white',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingText: {
    fontSize: 16,
    color: 'white',
  },
});

export default HotelCard;
