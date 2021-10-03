export class Session {
  public static get<T>(key: string, defaultValue?: T): T | undefined {
    const value = window.sessionStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return JSON.parse(value);
  }

  public static set<T>(key: string, value: T): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  public static clear(): void {
    window.sessionStorage.clear();
  }

  public static async currentSession(): Promise<Parse.Session | null> {
    return await Parse.Session.current();
  }

  // private async currentSessionId(): Promise<string | null> {
  //     const session = await Session.currentSession()
  //
  //     if (!session || !session.getSessionToken()) {
  //         return null
  //     }
  //
  //     return session.getSessionToken()
  // }
}
