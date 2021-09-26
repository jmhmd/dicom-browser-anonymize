async function readFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer !== true) {
        reject(new Error('Did not return ArrayBuffer'));
      } else {
        resolve(reader.result as ArrayBuffer);
      }
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsArrayBuffer(file);
  });
}

export default async function readImagesToArrayBuffer(files: FileList) {
  const fileArrayBuffers: ArrayBuffer[] = await Promise.allSettled(
    Array.from(files).map(readFileToArrayBuffer)
  ).then((results) => {
    return results
      .map((result) => {
        if (result.status === 'fulfilled') return result.value;
        console.error(result.reason);
        return result.status;
      })
      .filter((result): result is ArrayBuffer => result instanceof ArrayBuffer);
  });
  return fileArrayBuffers;
}
