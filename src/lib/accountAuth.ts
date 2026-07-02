export function makeAccountEmail(username: string) {
  return `dj-${hashUsername(username)}@iskanderdj.app`;
}

export function makePossibleAccountEmails(username: string) {
  const hash = hashUsername(username);
  return [
    `dj-${hash}@iskanderdj.app`,
    `user-${hash}@iskander-dj.example.com`,
    `user-${hash}@iskander-dj.local`,
  ];
}

function hashUsername(username: string) {
  let hash = 0;
  for (const letter of username) {
    hash = (hash * 31 + letter.codePointAt(0)!) >>> 0;
  }
  return hash.toString(16);
}
