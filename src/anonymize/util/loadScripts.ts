import Script from '../Script';

function mergeScripts(script1: Script, script2: Script) {
  for (const variable of script2.variables) {
    const existing = script1.variables.find((v) => v.name === variable.name);
    if (existing) {
      existing.value = variable.value;
    } else {
      script1.variables.push(variable);
    }
  }

  for (const rule of script2.rules) {
    const existing = script1.rules.find((r) => r.tag === rule.tag);
    if (existing) {
      existing.enabled = rule.enabled;
      if (rule.name) {
        existing.name = rule.name;
      }
      existing.operation = rule.operation;
    } else {
      script1.rules.push(rule);
    }
  }

  script1.options = Object.assign(script1.options, script2.options);

  return script1;
}

export default function loadScripts(scriptsArray: Script[]) {
  const [baseScript, ...scriptsToMerge] = scriptsArray;
  let mergedScript = baseScript;
  for (let script of scriptsToMerge) {
    mergedScript = mergeScripts(mergedScript, script);
  }
  for (let rule of mergedScript.rules) {
    rule.tag = rule.tag.toUpperCase();
  }
  return mergedScript;
}
