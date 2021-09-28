/**
 * @typedef {import('../Script').default} Script
 * @typedef {import('../Script').ScriptRule} Rule
 * @typedef {import('../../DicomDict2').default} DicomDict2
 * @typedef {'upsert' | 'empty' | 'keep' | 'remove' | 'append'} Operation
 */

import { resolveParams } from './resolveParams';
import anonFunctions from '../functions';
import { log } from './logger';

/**
 *
 * @param {Rule} rule
 * @param {Script} script
 * @param {DicomDict2} dicomDataset
 * @returns {[Operation, string?]} Array [operation, value?]
 */
export default function resolveOperation(rule, script, dicomDataset) {
  const { tag } = rule;
  const { operationName } = rule.operation;

  // Resolve rule operation
  if (operationName === 'empty') {
    return ['empty'];
  }

  if (operationName === 'keep') {
    return ['keep'];
  }

  if (operationName === 'remove') {
    return ['remove'];
  }

  // if (operationName === 'deidmethodcodeseq') {
  //   const [...codeSeqs] = resolveParams(rule, script, dicomDataset);
  //   const sequenceMembers = codeSeqs.map(codeSeq => {

  //   })
  //   return ['append']
  // }

  if (operationName === 'hashuid') {
    const [root, valueToHash] = resolveParams(rule, script, dicomDataset);
    if (!root || typeof root !== 'string' || typeof valueToHash !== 'string') {
      throw new Error(
        `Both parameters for "hashuid" must be a string. Rule ${JSON.stringify(rule)}`
      );
    }
    if (!valueToHash) {
      log(
        'warn',
        `No value resolved for hash function. Rule: ${JSON.stringify(
          rule
        )}. Setting element value to empty string.`
      );
      // console.warn(
      //   `No value resolved for hash function. Rule: ${JSON.stringify(
      //     rule
      //   )}. Setting element value to empty string.`
      // );
      return ['upsert', ''];
    }
    const newValue = anonFunctions.hashuid(root, valueToHash);
    return ['upsert', newValue];
  }

  if (operationName === 'hash') {
    const [valueToHash, maxChars] = resolveParams(rule, script, dicomDataset);
    if (!valueToHash || typeof valueToHash !== 'string') {
      log(
        'warn',
        `No value resolved for hash function. Rule: ${JSON.stringify(
          rule
        )}. Setting element value to empty string.`
      );
      // console.warn(
      //   `No value resolved for hash function. Rule: ${JSON.stringify(
      //     rule
      //   )}. Setting element value to empty string.`
      // );
      return ['upsert', ''];
    }
    if (maxChars && typeof maxChars !== 'string') {
      throw new Error(
        `Optional second parameter for hash function must be numeric string. Rule: ${JSON.stringify(
          rule
        )}`
      );
    }
    const newValue = anonFunctions.hash(valueToHash, maxChars);
    return ['upsert', newValue];
  }

  if (operationName === 'hashdate') {
    const [dateToIncrement, valueToHashForIncrement] = resolveParams(rule, script, dicomDataset);
    if (dateToIncrement === '') {
      log(
        'warn',
        `No value resolved for date. Rule: ${JSON.stringify(
          rule
        )}. Setting element value to empty string.`
      );
      // console.warn(
      //   `No value resolved for date. Rule: ${JSON.stringify(
      //     rule
      //   )}. Setting element value to empty string.`
      // );
      return ['upsert', ''];
    }
    if (
      !dateToIncrement ||
      !valueToHashForIncrement ||
      typeof dateToIncrement !== 'string' ||
      typeof valueToHashForIncrement !== 'string'
    ) {
      throw new Error(
        `Two element name parameters required for "hashdate". Rule ${JSON.stringify(rule)}`
      );
    }
    const newValue = anonFunctions.hashdate(dateToIncrement, valueToHashForIncrement);
    return ['upsert', newValue];
  }

  if (operationName === 'date') {
    const [separator] = resolveParams(rule, script, dicomDataset);
    if (typeof separator !== 'string' && separator !== undefined) {
      throw new Error(`Separator parameter must be a string. Rule: ${JSON.stringify(rule)}`);
    }
    const newDate = anonFunctions.date(separator);
    return ['upsert', newDate];
  }

  if (operationName === 'time') {
    const [separator] = resolveParams(rule, script, dicomDataset);
    if (typeof separator !== 'string' && separator !== undefined) {
      throw new Error(`Separator parameter must be a string. Rule: ${JSON.stringify(rule)}`);
    }
    const newDate = anonFunctions.time(separator);
    return ['upsert', newDate];
  }

  if (operationName === 'require') {
    const [valueIfNotExists, defaultValue] = resolveParams(rule, script, dicomDataset);
    const existingElement = dicomDataset.dict[tag];
    if (existingElement) {
      return ['keep'];
    }
    const newElementValue = valueIfNotExists || defaultValue || '';
    if (typeof newElementValue !== 'string') {
      throw new Error(`New value for element must be a string. Rule: ${JSON.stringify(rule)}`);
    }
    return ['upsert', newElementValue];
  }

  if (operationName === 'always') {
    const [newValue] = resolveParams(rule, script, dicomDataset);
    if (typeof newValue !== 'string') {
      throw new Error(
        `Parameter for 'always' did not evaluate to a string. Rule ${JSON.stringify(rule)}`
      );
    }
    return ['upsert', newValue];
  }

  if (operationName === 'param') {
    const [paramValue] = resolveParams(rule, script, dicomDataset);
    if (typeof paramValue !== 'string') {
      throw new Error(`Parameter for 'param' must be a string. Rule ${JSON.stringify(rule)}`);
    }
    return ['upsert', paramValue];
  }

  log(
    'warn',
    `Function ${rule.operation.operationName} is not yet supported. Emptying tag for safety. Use '@keep()' if you would like to keep this field value.`
  );
  // console.warn(
  //   `Function ${rule.operation.operationName} is not yet supported. Emptying tag for safety. Use '@keep()' if you would like to keep this field value.`
  // );
  return ['empty'];
}
