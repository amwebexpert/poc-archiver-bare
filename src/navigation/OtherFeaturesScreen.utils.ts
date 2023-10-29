import axios from "axios";

export const loadUsersDemo = async () => {
  const url = "https://jsonplaceholder.typicode.com/users";

  const result = await axios.get(url);
  const persons = result.data;

  console.log(`Loaded ${persons.length} users from jsonplaceholder api call`);
};
