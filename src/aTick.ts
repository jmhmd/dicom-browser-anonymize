/**
 * Await a timeout of 0 milliseconds to allow Vue to update DOM when doing resource intensive
 * processing loops. Skip if tab is not visible to prevent throttling from stopping all processing.
 * @return {Promise<void>}
 */
export default async function aTick() {
  if (document.hidden) {
    return;
  }
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 0);
  });
}
