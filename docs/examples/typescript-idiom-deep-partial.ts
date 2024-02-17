export type DeepPartial<T> = T extends Function ? T : DeepPartialArrayOrObject<T>;

export type DeepPartialArrayOrObject<TArrayOrObject> = TArrayOrObject extends Array<infer TElement>
  ? DeepPartialArray<TElement>
  : DeepPartialObject<TArrayOrObject>;

export type DeepPartialArray<TElement> = Array<DeepPartial<TElement>>;

export type DeepPartialObject<TObject> = {
  [Key in keyof TObject]?: DeepPartial<TObject[Key]>;
};

type ConfigsType = {
  title: string;
  key: string;
  subConfigs: {
    title: string;
    key: string;
  };
};

export const fullConfigs: ConfigsType = {
  title: "my-title",
  key: "my-key",
  subConfigs: {
    title: "my-sub-title",
    key: "my-sub-key", // try to comment key: Property 'key' is required in type '{ title: string; key: string; }'
  },
};

export const partialConfigs: DeepPartial<ConfigsType> = {
  key: "my-key",
  subConfigs: {
    title: "my-sub-title",
  },
};
