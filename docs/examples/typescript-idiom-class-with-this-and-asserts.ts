type ProfileInfo = {
  name: string;
  userToken: string;
};

export class AppUser {
  userToken?: string;

  get isUserAuthenticated(): boolean {
    return !!this.userToken;
  }

  assertsUserLoggedIn(): asserts this is this & { userToken: string } {
    if (!this.isUserAuthenticated) {
      throw new Error("User is not logged in");
    }
  }

  getProfileInfo(): ProfileInfo {
    this.assertsUserLoggedIn();

    return {
      name: "John Doe",
      userToken: this.userToken,
    };
  }
}
