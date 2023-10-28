import {View, StyleSheet} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {AppLayout} from '../../components/layout/AppLayout';
import { AppTheme } from '../../theme';

export const DeviceInfoScreen = (): JSX.Element => {
  const styles = useStyles();
  const navigation = useNavigation();

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <View style={styles.params}>
          <Text>Device Info</Text>
        </View>

        <Button icon="home" mode="outlined" onPress={() => navigation.goBack()}>
          Home
        </Button>
      </View>
    </AppLayout>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    params: {
      flex: 1,
      width: '100%',
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
  });
};
