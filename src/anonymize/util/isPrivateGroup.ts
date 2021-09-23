export default function isPrivateGroup(tag: string) {
  return parseInt(tag.substr(3, 1), 10) % 2;
}
