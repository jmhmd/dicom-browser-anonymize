const headerScriptRegex =
  /(?:<p t="(\S+)">(.+)<)|(?:<e.+t="(\S+)".+n="(\S+)">(.+)<)|(?:<k.+t="(\S+)")|(?:<r.+t="(\S+)")/gm;
const typeRegex = /<([a-z])/;
const enRegex = /en="(\S)"/;
const tagRegex = /t="(\S+)"/;
const nameRegex = /n="(\S+)"/;
const valueRegex = />(.+)<\//;

export interface AnonymizationRule {
  line: string;
  type: string;
  en?: string | null;
  tag: string;
  name?: string | null;
  value?: string | null;
}

function parseScriptRules(script: string) {
  const lines = script.split(/\r\n|\n\r|\n|\r/);
  const rules: AnonymizationRule[] = [];
  for (const line of lines) {
    if (line.trim() === '<script>' || line.trim() === '</script>' || line.length < 1) {
      continue;
    }
    const typeMatch = line.match(typeRegex);
    const tagMatch = line.match(tagRegex);
    const enMatch = line.match(enRegex);
    const nameMatch = line.match(nameRegex);
    const valueMatch = line.match(valueRegex);
    if (!typeMatch || !tagMatch) {
      console.log(`Did not find required properties for line ${line}`);
      continue;
    }
    rules.push({
      line,
      type: typeMatch && typeMatch[1],
      tag: tagMatch && tagMatch[1].toUpperCase(),
      en: enMatch && enMatch[1],
      name: nameMatch && nameMatch[1],
      value: valueMatch && valueMatch[1],
    });
  }
  return rules;
}

/* function getHeaderScriptRules(script: string) {
  let m;
  let matches: { match: string; type: string; tag: string; name?: string; value: string }[] = [];
  while ((m = headerScriptRegex.exec(script)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === headerScriptRegex.lastIndex) {
      headerScriptRegex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    const [match, ptag, pvalue, etag, ename, evalue, ktag, rtag] = m;
    const type = ptag ? 'p' : etag ? 'e' : ktag ? 'k' : rtag ? 'r' : 'unknown';
    const tag = ptag || etag || ktag || rtag;
    const value = pvalue || evalue;
    matches.push({
      match,
      type,
      tag,
      name: ename,
      value,
    });
  }
  return matches;
} */

export async function getHeaderAnonymizationRules(url: string) {
  const file = await window.fetch(url);
  const xmlString = await file.text();
  const scriptRules = parseScriptRules(xmlString);
  return scriptRules;
}

/**
 * In way over my head here trying to parse the more complex pixel anonymization script. Will leave
 * out support for now.
 */
/* const pixelSignatureRegionsRegex =
  /{\s+(?:([^}]+)|\n)+\s+}\s*\n\s*((?:\([0-9]+,[0-9]+,[0-9]+,[0-9]+\)\s*)+)/gm;

function getPixelScriptSignaturesRegions(script: string) {
  let m;
  let matches: { match: string; signatures: string; regions: string }[] = [];
  while ((m = pixelSignatureRegionsRegex.exec(script)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === pixelSignatureRegionsRegex.lastIndex) {
      pixelSignatureRegionsRegex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    const [match, signatures, regions] = m;
    matches.push({
      match,
      signatures: signatures.trim(),
      regions: regions.trim(),
    });
  }
  return matches;
}

function getPixelScriptRules(script: string) {
  const signaturesRegions = getPixelScriptSignaturesRegions(script);
  console.log(signaturesRegions);
}

export async function getPixelAnonymizationScript(url: string) {
  const file = await window.fetch(url);
  const scriptString = await file.text();
  const scriptObj = getPixelScriptRules(scriptString);
  console.log(scriptObj);
}
 */
