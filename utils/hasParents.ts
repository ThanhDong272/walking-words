/**
 *
 * @param {Array} parents
 * @param {string} type
 * @return {boolean}
 */
export default function hasParents(parents: any[], type: string) {
  return parents.findIndex((el) => el.type === type) > -1;
}
