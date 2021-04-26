import lang from "./en.json";

// dynamically create keys
type LangKeys = keyof typeof lang;

class Language {
  /**
   * returns a value in specified locale
   */
  public translate(key: LangKeys) {
    return lang[key];
  }
}

export const Lang = new Language();
