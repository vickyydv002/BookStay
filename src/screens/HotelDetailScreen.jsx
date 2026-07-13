import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {hotelDetailsById} from '../constants/hotelDetails';
import ImageCarousel from '../components/ImageCarousel';
import Button from '../components/Button';

export function HotelDetailScreen() {
  const {hotelId} = useRoute().params;
  const insets = useSafeAreaInsets();
  const [hotelDetails, setHotelDetails] = useState(null);

  const fetchHotelDetails = useCallback(() => {
    const response = hotelDetailsById?.[hotelId];
    setHotelDetails(response);
  }, [hotelId]);

  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  const handleBookNow = () => {
    // we will add booking logic later
    console.log('Book Now pressed for hotel:', hotelId);
  };

  return (
    <View style={styles.container}>
      {/* scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageCarousel images={hotelDetails?.galleryImages || []} />

        <View style={styles.hotelDetailsContainer}>
          <Text style={styles.title}>{hotelDetails?.name}</Text>
          <Text style={styles.description}>{hotelDetails?.description}</Text>
        </View>
      </ScrollView>

      {/* button stuck to the bottom of the screen */}
      <View
        style={[
          styles.bottomBar,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <Button title="Book Now" type="primary" onPress={handleBookNow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100, // space so content is not hidden behind bottom button
  },
  hotelDetailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
});
