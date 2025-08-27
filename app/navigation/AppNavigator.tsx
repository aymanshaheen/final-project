import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import LocationPermissionScreen from '../screens/LocationPermissionScreen';
import MapScreen from '../screens/MapScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import { colors } from '@styles';

export type RootStackParamList = {
  Permission: undefined;
  Map: undefined;
  PlaceDetails: { id: string | number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="Permission"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Permission" component={LocationPermissionScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen
        name="PlaceDetails"
        component={PlaceDetailsScreen}
        options={{
          headerShown: true,
          title: 'Place Details',
          headerStyle: { backgroundColor: colors.backgroundPrimary },
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white, fontWeight: '700' },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
