import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  UserLogin: undefined;
  RestaurantLogin: undefined;
};

export type UserTabParamList = {
  Home: undefined;
  Search: undefined;
  AI: undefined;
  UserReservations: undefined;
  Profile: undefined;
};

export type UserStackParamList = {
  UserTabs: NavigatorScreenParams<UserTabParamList> | undefined;
  RestaurantDetail: { restaurantId: string };
  CreateReservation: { restaurantId: string; restaurantName?: string };
};

export type RestaurantTabParamList = {
  Dashboard: undefined;
  Reservations: undefined;
  MyLocal: undefined;
  OwnerProfile: undefined;
};

export type RestaurantStackParamList = {
  RestaurantTabs: undefined;
  NewLocal: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  UserApp: undefined;
  RestaurantApp: undefined;
};
