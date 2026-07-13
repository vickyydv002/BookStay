import {FlatList, Image, StyleSheet, useWindowDimensions, View} from 'react-native';
import React, {useState} from 'react';

/**
 * Simple image carousel.
 * Swipe left/right to see gallery images.
 */
const ImageCarousel = ({images = []}) => {
  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return null;
  }

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item}-${index}`}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({item}) => (
          <Image source={{uri: item}} style={{width, height: 240}} />
        )}
      />

      {/* dots under the carousel */}
      <View style={styles.dots}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#111827',
  },
});

export default ImageCarousel;
