import {createNavigationContainerRef} from '@react-navigation/native';

export type NavRaramList = {
  IndexPage: undefined;
  SignupPage: undefined;
  MainPage: undefined;
  myPage: undefined;
  Box: undefined;
};

export const navigationRef = createNavigationContainerRef<NavRaramList>();

export function navigate<RouteName extends keyof NavRaramList>(
  name: RouteName,
  params?: NavRaramList[RouteName],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
