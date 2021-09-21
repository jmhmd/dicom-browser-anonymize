export default function knownTransferSyntax(transferSyntax: string) {
  if (transferSyntax === '1.2.840.10008.1.2') {
    // Implicit VR Little Endian
    return 'Implicit VR Little Endian';
  } else if (transferSyntax === '1.2.840.10008.1.2.1') {
    // Explicit VR Little Endian
    return 'Explicit VR Little Endian';
  } else if (transferSyntax === '1.2.840.10008.1.2.2') {
    // Explicit VR Big Endian (retired)
    return 'Explicit VR Big Endian (retired)';
  } else if (transferSyntax === '1.2.840.10008.1.2.1.99') {
    // Deflate transfer syntax (deflated by dicomParser)
    return 'Deflate transfer syntax (deflated by dicomParser)';
  } else if (transferSyntax === '1.2.840.10008.1.2.5') {
    // RLE Lossless
    return 'RLE Lossless';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.50') {
    // JPEG Baseline lossy process 1 (8 bit)
    return 'JPEG Baseline lossy process 1 (8 bit)';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.51') {
    // JPEG Baseline lossy process 2 & 4 (12 bit)
    return 'JPEG Baseline lossy process 2 & 4 (12 bit)';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.57') {
    // JPEG Lossless, Nonhierarchical (Processes 14)
    return 'JPEG Lossless, Nonhierarchical (Processes 14)';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.70') {
    // JPEG Lossless, Nonhierarchical (Processes 14 [Selection 1])
    return 'JPEG Lossless, Nonhierarchical (Processes 14 [Selection 1])';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.80') {
    // JPEG-LS Lossless Image Compression
    return 'JPEG-LS Lossless Image Compression';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.81') {
    // JPEG-LS Lossy (Near-Lossless) Image Compression
    return 'JPEG-LS Lossy (Near-Lossless) Image Compression';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.90') {
    // JPEG 2000 Lossless
    return 'JPEG 2000 Lossless';
  } else if (transferSyntax === '1.2.840.10008.1.2.4.91') {
    // JPEG 2000 Lossy
    return 'JPEG 2000 Lossy';
  } else if (transferSyntax === 'HTJ2K') {
    // High Throughput JPEG 2000
    return 'High Throughput JPEG 2000';
  } else {
    throw new Error(`No decoder for transfer syntax ${transferSyntax}`);
  }
}
