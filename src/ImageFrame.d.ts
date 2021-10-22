export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array;

export default interface ImageFrame {
  bitsAllocated: number;
  bitsPerPixel: number;
  bitsStored: number;
  blockDimensions: string; // "64 x 64"
  bytesPerPixel: number;
  colorTransform: number; // 0;
  columns: number; // 512
  componentsPerPixel: number; // 1
  compressionRatio: string; //"3.01:1"
  decodeTimeInMS: number; // 273
  decodedSize: string; // "524,288 bytes"
  // encodeOptions: {imageOffset: 'x: 0, y: 0', numDecompositions: 5, numLayers: 1, progessionOrder: 'LRCP', reversible: true, …}
  // greenPaletteColorLookupTableData: undefined
  // greenPaletteColorLookupTableDescriptor: undefined
  // bluePaletteColorLookupTableData: undefined
  // bluePaletteColorLookupTableDescriptor: undefined
  imageInfo: {
    bitsPerPixel: number; // 16
    bytesPerPixel: number; // undefined
    columns: number; // 512
    componentsPerPixel: number; // 1
    rows: number; // 512
    signed: boolean; // true
  };
  imageOffset: 'x: 0, y: 0';
  largestPixelValue: 2278;
  numDecompositions: 5;
  numLayers: 1;
  photometricInterpretation: 'MONOCHROME2';
  pixelData: TypedArray;
  pixelDataLength: number; // 262144
  pixelRepresentation: number; // 1
  // planarConfiguration: undefined
  progessionOrder: string; // "LRCP"
  // redPaletteColorLookupTableData: undefined
  // redPaletteColorLookupTableDescriptor: undefined
  reversible: boolean; // true
  rows: number; // 512
  samplesPerPixel: number; // 1
  signed: number; // true
  smallestPixelValue: number; // -2000
  tileOffset: string; //"0, 0"
}
