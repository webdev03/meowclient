export default class CloudEncoder {
  charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1234567890! @#$%^&*()_-.\";:'?><,/".split(
      ""
    );
  encode(string: string) {
    let result = "";
    for (let i = 0; i < string.length; i++) {
      result += this.charset.findIndex((x) => x === string[i]) + 10;
    }
    return result + "00";
  }
  *decode(string: string) {
    let value = "";
    for (let i = 1; i < string.length; i += 2) {
      const idx = Number(string[i - 1] + string[i]) - 10;
      if (idx < 0) {
        yield value;
        value = "";
      } else value += this.charset[idx];
    }
  }
}
