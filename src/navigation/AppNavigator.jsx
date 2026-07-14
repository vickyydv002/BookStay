import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from '../screens/HomeScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {HotelDetailScreen} from '../screens/HotelDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import {MyBookingsScreen} from '../screens/MyBookingsScreen';
import {BookingDetailsScreen} from '../screens/BookingDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HotelDetail"
        component={HotelDetailScreen}
        options={{title: 'Hotel Detail'}}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{title: 'Book a Room'}}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{title: 'My Bookings'}}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{title: 'Booking Details'}}
      />
    </Stack.Navigator>
  );
}
