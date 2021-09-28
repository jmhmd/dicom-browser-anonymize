/**
 * @typedef {import('./Script').default} Script
 * @typedef {import('./Script').ScriptRule} Rule
 * @typedef {import('../DicomDict2').default} DicomDict2
 */

import { addTag, emptyTag, removeTag, replaceTag } from './util/modifyTag';
import resolveOperation from './util/resolveOperation';
import { log } from './util/logger.js';

/**
 *
 * @param {Rule} rule
 * @param {Script} script
 * @param {DicomDict2} dicomDataset
 */
export default function processRule(rule, script, dicomDataset) {
  const options = script.options;
  const { tag } = rule;
  const datasetElement = dicomDataset.dict[tag] || dicomDataset.meta[tag];

  if (!rule.enabled) {
    if (options.removeDisabled) {
      removeTag(dicomDataset, tag);
    } else {
      return false;
    }
  }

  if (!rule.operation) {
    log('warn', `No operation defined for tag ${tag}. Removing.`);
    // console.warn(`No operation defined for tag ${tag}. Removing.`);
    removeTag(dicomDataset, tag);
  }

  if (
    !datasetElement &&
    !['append', 'require', 'always', 'upsert'].includes(rule.operation.operationName)
  ) {
    log(
      'info',
      `DICOM tag ${tag} not contained in DICOM dataset, cannot '${rule.operation.operationName}'.`
    );
    // console.log(
    //   `DICOM tag ${tag} not contained in DICOM dataset, cannot '${rule.operation.operationName}'.`
    // );
    return false;
  }

  const [resolvedOperation, value] = resolveOperation(rule, script, dicomDataset);

  // Process rule operation
  if (resolvedOperation === 'empty') {
    if (!datasetElement) {
      return true;
    }
    emptyTag(dicomDataset, tag, datasetElement.vr);
    return true;
  }

  if (resolvedOperation === 'keep') {
    return true;
  }

  if (resolvedOperation === 'remove') {
    removeTag(dicomDataset, tag);
    return true;
  }

  if (resolvedOperation === 'upsert') {
    if (!datasetElement) {
      addTag(dicomDataset, tag, value);
      return true;
    }
    replaceTag(dicomDataset, tag, datasetElement.vr, value);
    return true;
  }

  if (resolvedOperation === 'append') {
    let newValue;
    if (!datasetElement) {
      newValue = value;
    } else {
      newValue = datasetElement.Value.push(value);
    }
    replaceTag(dicomDataset, tag, datasetElement.vr, newValue);
  }

  throw new Error(`No valid operation for tag "${tag}"`);
}
