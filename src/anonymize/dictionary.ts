import dcmjs from 'dcmjs';

export function tagToName(tag: string) {
  const punctuatedTag = dcmjs.data.DicomMetaDictionary.punctuateTag(tag);
  const entry = dcmjs.data.DicomMetaDictionary.dictionary[punctuatedTag];
  return entry?.name;
}

export function nameToTag(name: string) {
  const entry = dcmjs.data.DicomMetaDictionary.dictionary.find((e: any) => e.name === name);
  if (!entry) return undefined;
  const unpunctuatedTag = dcmjs.data.DicomMetaDictionary.unpunctuateTag(entry.tag);
  return unpunctuatedTag;
}
