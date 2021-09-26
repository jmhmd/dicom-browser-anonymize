Run a specific ts file to test:
`node --loader ts-node/esm --experimental-specifier-resolution=node hashuid.spec.ts`

Diff
`diff <(dcmdump ~/dev/dicom-browser-anonymize/public/dicom-an/CT1_J2KR) <(dcmdump anonymized-dicom-file.dcm)`
