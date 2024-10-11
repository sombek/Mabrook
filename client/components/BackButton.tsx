import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@roninoss/icons';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <Icon name="chevron-right" size={16} color="#fff" />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
    // paddingLeft: 20,
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
});
