import { PropsWithChildren, createContext, useContext, useState } from "react";

import { Snackbar } from "react-native-paper";

const DEFAULT_DURATION = 2 * 1000;

export const SnackbarContext = createContext({
  showSnackbarMessage: (_msg: string, _duration = DEFAULT_DURATION) => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(DEFAULT_DURATION);

  const showSnackbarMessage = (msg: string, duration = DEFAULT_DURATION) => {
    setMessage(msg);
    setDuration(duration);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbarMessage }}>
      {children}

      <Snackbar visible={message.length > 0} onDismiss={() => setMessage("")} duration={duration}>
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
