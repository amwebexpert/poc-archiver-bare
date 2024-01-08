import { FunctionComponent, useState } from "react";

import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import DatePicker from "react-native-date-picker";
import { AppLayout } from "../../components/layout/AppLayout";

const DatePickerScreen: FunctionComponent = () => {
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DatePickerScreen;
