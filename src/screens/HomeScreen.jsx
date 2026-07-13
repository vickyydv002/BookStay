import {StyleSheet, View, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState, useEffect, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';

import {hotels} from '../constants/hotel';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import FilterAndSort from '../components/FilterAndSort';

const getRoomPrice = hotel => hotel.rooms?.[0]?.rent_per_night ?? 0;

const applyFilter = (list, filterId) => {
  switch (filterId) {
    case 'available':
      return list.filter(hotel =>
        hotel.rooms?.some(room => room.available),
      );
    case 'rating_4_5':
      return list.filter(hotel => hotel.ratings >= 4.5);
    case 'rating_4_8':
      return list.filter(hotel => hotel.ratings >= 4.8);
    case 'under_300':
      return list.filter(hotel => getRoomPrice(hotel) < 300);
    case 'all':
    default:
      return list;
  }
};

const applySort = (list, sortId) => {
  const next = [...list];

  switch (sortId) {
    case 'rating_desc':
      return next.sort((a, b) => b.ratings - a.ratings);
    case 'price_asc':
      return next.sort((a, b) => getRoomPrice(a) - getRoomPrice(b));
    case 'price_desc':
      return next.sort((a, b) => getRoomPrice(b) - getRoomPrice(a));
    case 'name_asc':
      return next.sort((a, b) => a.name.localeCompare(b.name));
    case 'default':
    default:
      return next;
  }
};

export function HomeScreen() {
  const navigation = useNavigation();
  const [allHotels, setAllHotels] = useState([]);
  const [searchHotel, setSearchHotel] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('default');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllHotels(hotels.hotels);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const hotelData = useMemo(() => {
    let list = allHotels;

    if (searchHotel.trim().length > 0) {
      const query = searchHotel.toLowerCase();
      list = list.filter(hotel => hotel.name.toLowerCase().includes(query));
    }

    list = applyFilter(list, selectedFilter);
    list = applySort(list, selectedSort);
    return list;
  }, [allHotels, searchHotel, selectedFilter, selectedSort]);

  const handleHotelPress = hotel => {
    navigation.navigate('HotelDetail', {hotelId: hotel.id});
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <SearchBar
            searchHotel={searchHotel}
            setSearchHotel={setSearchHotel}
            handleSearch={() => {}}
          />
        </View>
        <FilterAndSort
          selectedFilter={selectedFilter}
          selectedSort={selectedSort}
          onFilterChange={setSelectedFilter}
          onSortChange={setSelectedSort}
        />
      </View>

      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={hotelData}
        renderItem={({item}) => (
          <HotelCard data={item} onPress={() => handleHotelPress(item)} />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: 16,
    gap: 16,
  },
});
