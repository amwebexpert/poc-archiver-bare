import { FunctionComponent, useState } from "react";

import { observer } from "mobx-react";
import { StyleSheet, View } from "react-native";
import { Button, useTheme, Text } from "react-native-paper";

import DatePicker from "react-native-date-picker";
import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

const DatePickerScreen: FunctionComponent = () => {
  const styles = useStyles();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text>{date.toISOString()}</Text>
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => setOpen(false)}
        />
        <Button icon="calendar" mode="outlined" onPress={() => setOpen(true)}>
          Pick date
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
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

export default observer(DatePickerScreen);
