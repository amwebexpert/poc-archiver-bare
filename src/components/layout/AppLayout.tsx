import {PropsWithChildren, useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {AppTheme} from '../../theme';

type Props = {
  title: string;
};

export const AppLayout = ({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const styles = useStyles();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({title});
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'left', 'right']}>
      <View style={styles.content}>{children}</View>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    content: {
      flex: 1,
      margin: theme.spacing(1),
    },
  });
};
