declare module "@env" {
  export const USERS_API_URL: string;
}

declare module "parse-svg-path" {
  type Command = [string, ...number[]];
  export default function pathParser(path: string): Command[];
}
