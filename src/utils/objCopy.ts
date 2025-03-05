export function objCopy<T>(obj: T): T {
  console.log("objCopy", JSON.stringify(obj));
  return JSON.parse(JSON.stringify(obj));
}
