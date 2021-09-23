import dcmjs from 'dcmjs';

interface Dictionary {
  [key: string]: {
    tag: string;
    vr: string;
    name: string;
    vm: string;
    version: string;
  };
}

const dictionary: Dictionary = dcmjs.data.DicomMetaDictionary.dictionary;
const punctuateTag = dcmjs.data.DicomMetaDictionary.punctuateTag;
const unpunctuateTag = dcmjs.data.DicomMetaDictionary.unpunctuateTag;

export function tagToName(tag: string) {
  const punctuatedTag = punctuateTag(tag);
  const entry = dictionary[punctuatedTag];
  return entry?.name;
}

export function nameToTag(name: string) {
  const entry = Object.values(dictionary).find((e: any) => e.name === name);
  if (!entry) return undefined;
  const unpunctuatedTag = unpunctuateTag(entry.tag);
  return unpunctuatedTag;
}

export function getTagVr(tag: string) {
  const punctuatedTag = punctuateTag(tag);
  const entry = dictionary[punctuatedTag];
  return entry.vr;
}
