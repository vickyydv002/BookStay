import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getHotelDetailsById} from '../constants/hotelDetails';
import ImageCarousel from '../components/ImageCarousel';
import Button from '../components/Button';
import {formatPrice} from '../utils/formatPrice';

export function HotelDetailScreen() {
  const navigation = useNavigation();
  const {hotelId} = useRoute().params;
  const insets = useSafeAreaInsets();
  const [hotelDetails, setHotelDetails] = useState(null);

  const fetchHotelDetails = useCallback(() => {
    const response = getHotelDetailsById(hotelId);
    setHotelDetails(response);
  }, [hotelId]);

  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  const handleBookNow = () => {
    navigation.navigate('Booking', {hotelId});
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageCarousel images={hotelDetails?.galleryImages || []} />

        <View style={styles.hotelDetailsContainer}>
          <Text style={styles.title}>{hotelDetails?.name}</Text>
          <Text style={styles.description}>{hotelDetails?.description}</Text>

          <View style={styles.inventoryRow}>
            <Text style={styles.inventoryText}>
              Total rooms: {hotelDetails?.totalRooms ?? '—'}
            </Text>
            <Text style={styles.inventoryText}>
              Available today: {hotelDetails?.availableRooms ?? '—'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Room pricing</Text>
          {(hotelDetails?.roomPricing || []).map(room => (
            <View key={room.type} style={styles.priceCard}>
              <Text style={styles.priceType}>{room.type}</Text>
              <Text style={styles.priceMeta}>
                Up to {room.maxGuests} guests
              </Text>
              <Text style={styles.priceAmount}>
                {formatPrice(room.pricePerNight)}
                <Text style={styles.perNight}> / night</Text>
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

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
    paddingBottom: 100,
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
    marginBottom: 16,
  },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  inventoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  priceCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  priceType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  priceMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 6,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  perNight: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
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
