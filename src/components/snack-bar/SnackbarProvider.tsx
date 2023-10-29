import { useState, PropsWithChildren, createContext, useContext } from "react";

import { Snackbar } from "react-native-paper";

export const SnackbarContext = createContext({
  showSnackbarMessage: (_: string) => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [message, setMessage] = useState("");
  const showSnackbarMessage = setMessage;

  return (
    <SnackbarContext.Provider value={{ showSnackbarMessage }}>
      {children}

      <Snackbar visible={message.length > 0} onDismiss={() => setMessage("")} duration={Snackbar.DURATION_SHORT}>
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
