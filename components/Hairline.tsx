import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from './theme';

/** A 1px warm divider. */
export function Hairline({ style }: { style?: ViewStyle }) {
  return <View style={[styles.hr, style]} />;
}

const styles = StyleSheet.create({
  hr: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.hairline,
  },
});
