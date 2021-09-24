import { parseScriptRules } from '../readAnonymizationScripts.js';
import parseParams from './parseParams.js';
import fs from 'fs';
import dcmjs from 'dcmjs';

/**
 * @typedef {import("../AnonymizationRule").AnonymizationRule} AnonymizationRule
 * @typedef {import("../../DicomDict2").default} DicomDict2
 */

/**
 * @type {AnonymizationRule[]}
 */
const testRules = [
  { line: '', type: 'e', tag: '00120062', name: 'PatientIdentityRemoved', value: '@always()YES' },
  {
    line: '',
    type: 'e',
    tag: '00120062',
    name: 'PatientIdentityRemoved',
    value: '@always()@date()',
  },
  {
    line: '',
    type: 'e',
    tag: '00080018',
    name: 'SOPInstanceUID',
    value: '@hashuid(@UIDROOT,this)',
  },
  { line: '', type: 'e', tag: '00100010', name: 'PatientID', value: '@hash(PatientID,10)' },
  {
    line: '',
    type: 'e',
    tag: '00120063',
    name: 'DeIdentificationMethod',
    value: '@append(){CTP: @param(@PROFILENAME): @date():@time()}',
  },
];

const scriptString = fs.readFileSync(
  '../../../public/anonymizer-scripts/dicom-anonymizer.default.script'
);
const anonymizationRules = parseScriptRules(scriptString.toString());
const fileArrayBuffer = fs.readFileSync('../../../public/dicom/CT1_J2KR');
/** @type {DicomDict2} */
const dicomData = dcmjs.data.DicomMessage.readFile(fileArrayBuffer.buffer);
const result = parseParams(testRules[2], anonymizationRules, dicomData);

console.log(result);
