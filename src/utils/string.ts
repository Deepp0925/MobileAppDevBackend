/* 
 replaces a keys in a static string(@paramstr) from an object(data)
 i.e. "Welcome {firstname} {lastname}", {firstname: "John", lastname: "Doe"} ->
 Welcome John Doe!
*/
export function inject<T extends object>(str: string, data: T) {
  if (typeof str === "string" && data instanceof Object) {
    if (Object.keys(data).length === 0) {
      return str;
    }

    for (let key in data) {
      str = str.replace(`{${key}}`, data[key] as any);
    }

    return str;
  } else return str;
}
