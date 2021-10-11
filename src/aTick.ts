/**
 * Await a timeout of 0 milliseconds to allow Vue to update DOM when doing resource intensive
 * processing loops
 * @return {Promise<void>}
 */
export default async function aTick() {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 0);
  });
}
