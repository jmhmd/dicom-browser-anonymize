/**
 * This object supports loading of DICOM P10 dataset from a uri and caching it so it can be accessed
 * by the caller.  This allows a caller to access the datasets without having to go through cornerstone's
 * image loader mechanism.  One reason a caller may need to do this is to determine the number of frames
 * in a multiframe sop instance so it can create the imageId's correctly.
 */
let cacheSizeInBytes = 0;

let loadedDataSets: { [key: string]: any } = {};

let promises: { [key: string]: any } = {};

// returns true if the wadouri for the specified index has been loaded
function isLoaded(uri: string) {
  return loadedDataSets[uri] !== undefined;
}

function get(uri: string) {
  if (!loadedDataSets[uri]) {
    return;
  }

  return loadedDataSets[uri].dataSet;
}

// loads the dicom dataset from the wadouri sp
function load(dataSet: any, uri: string) {
  // if already loaded return it right away
  if (loadedDataSets[uri]) {
    // console.log('using loaded dataset ' + uri);
    return new Promise((resolve) => {
      loadedDataSets[uri].cacheCount++;
      resolve(loadedDataSets[uri].dataSet);
    });
  } else {
    loadedDataSets[uri] = {
      dataSet,
      cacheCount: 1,
    };
  }

  return Promise.resolve(dataSet);
}

// remove the cached/loaded dicom dataset for the specified wadouri to free up memory
function unload(uri: string) {
  // console.log('unload for ' + uri);
  if (loadedDataSets[uri]) {
    loadedDataSets[uri].cacheCount--;
    if (loadedDataSets[uri].cacheCount === 0) {
      // console.log('removing loaded dataset for ' + uri);
      cacheSizeInBytes -= loadedDataSets[uri].dataSet.byteArray.length;
      delete loadedDataSets[uri];
    }
  }
}

export function getInfo() {
  return {
    cacheSizeInBytes,
    numberOfDataSetsCached: Object.keys(loadedDataSets).length,
  };
}

// removes all cached datasets from memory
function purge() {
  loadedDataSets = {};
  promises = {};
  cacheSizeInBytes = 0;
}

export default {
  isLoaded,
  load,
  unload,
  getInfo,
  purge,
  get,
};
