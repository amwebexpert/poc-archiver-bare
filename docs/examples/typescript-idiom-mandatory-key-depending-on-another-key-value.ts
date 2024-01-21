export type LoginEventPayload = {
  userId: string;
};

export type NavigateEventPayload = {
  path: string;
};

export type AppEvent =
  | {
      type: "login";
      payload: LoginEventPayload;
    }
  | {
      type: "logout";
    }
  | {
      type: "navigate";
      payload: NavigateEventPayload;
    };

export type AppEventType = AppEvent["type"];

export const sendEventUnsafe = (type: AppEventType, payload?: any) => {
  // eslint-disable-next-line no-console
  console.info("====>>> info", { type, payload });
};

export const sendEvent = <TEventName extends AppEventType>(
  ...args: Extract<AppEvent, { type: TEventName }> extends { payload: infer TEventPayload }
    ? [type: TEventName, payload: TEventPayload]
    : [type: TEventName]
) => {
  console.info("====>>> info", args);
};

// intermediate types to help understand the above type
type LoginAppEvent = Extract<AppEvent, { type: "login" }>;
type LogoutAppEvent = Extract<AppEvent, { type: "logout" }>;
type NavigateAppEvent = Extract<AppEvent, { type: "navigate" }>;
type LoginAppEventHasPayload = LoginAppEvent extends { payload: any } ? true : false; // true
type LogoutAppEventHasPayload = LogoutAppEvent extends { payload: any } ? true : false; // false

sendEvent("login", { userId: "123" }); // ok
sendEvent("navigate", { path: "/home" }); // ok
sendEvent("logout"); // ok

// @ts-expect-error
sendEvent("login"); // error - payload is missing

// @ts-expect-error
sendEvent("login", { foo: "bar" }); // error - payload is invalid

// @ts-expect-error
sendEvent("logout", { foo: "bar" }); // error - payload is not expected
