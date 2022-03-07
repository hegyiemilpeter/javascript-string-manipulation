// Create a tagged template lf`...` that formats text using LF line endings.
var lf = (stringLiterals, ...values) => {
  return stringLiterals.reduce((res, current, index) =>{
    let transformedLiteral = transformLineEnding(current, LineEndings.LF);
    let transformedValue = (values[index] != null ? values[index] : "");

    if(!Object.getOwnPropertySymbols(transformedValue).includes(disableConverter)){
      transformedValue = transformLineEnding(transformedValue, LineEndings.LF);
    }

    return `${res}${transformedLiteral}${transformedValue}`;
  },"");
};

// Create a tagged template cr`...` that formats text using CR line endings.
var cr = (stringLiterals, ...values) => {
  return stringLiterals.reduce((res, current, index) =>{
    let transformedLiteral = transformLineEnding(current, LineEndings.CF);
    let transformedValue = (values[index] != null ? values[index] : "");

    if(!Object.getOwnPropertySymbols(transformedValue).includes(disableConverter)){
      transformedValue = transformLineEnding(transformedValue, LineEndings.CF);
    }

    return `${res}${transformedLiteral}${transformedValue}`;
  },"");
};

// Create a tagged template crlf`...` that formats text using CRLF line endings.
var crlf = (stringLiterals, ...values) => {
  return stringLiterals.reduce((res, current, index) =>{
    let transformedLiteral = transformLineEnding(current, LineEndings.CRLF);
    let transformedValue = (values[index] != null ? values[index] : "");

    if(!Object.getOwnPropertySymbols(transformedValue).includes(disableConverter)){
      transformedValue = transformLineEnding(transformedValue, LineEndings.CRLF);
    }

    return `${res}${transformedLiteral}${transformedValue}`;
  },"");
};


const transformLineEnding = (string, lineEnding) => {
  string = (string != null ? string.toString() : "");
  const { replaceCRLF, replaceLF, replaceCR } = LineEndingReplacements;

  if (lineEnding === LineEndings.CR) {
    string = replaceCRLF(string, "\r");
    string = replaceLF(string, "\r");
  } else if (lineEnding === LineEndings.LF) {
    string = replaceCRLF(string, "\n");
    string = replaceCR(string, "\n");
  } else if (lineEnding === LineEndings.CRLF) {
    string = replaceCR(string, "\r\n");
    string = replaceLF(string, "\r\n");
  }
  return string;
};

const LineEndings = {
  CR: Symbol("CR"),
  LF: Symbol("LF"),
  CRLF: Symbol("CRLF")
};

const LineEndingReplacements = {
  replaceCR: (string, newEnding) =>
    string.replace(/(\r+)([^\n]|$)/g, (_match, p1, p2) => {
      return `${newEnding.repeat(p1.length)}${p2}`;
    }),

  replaceLF: (string, newEnding) =>
    string.replace(/([^\r]|^)(\n+)/g, (_match, p1, p2) => {
      return `${p1}${newEnding.repeat(p2.length)}`;
    }),

  replaceCRLF: (string, newEnding) => string.replace(/\r\n/g, `${newEnding}`)
};

const disableConverter = Symbol.for("crlf-converter-disable");

module.exports = {
  lf,
  cr,
  crlf,
  LineEndings,
  transformLineEnding,
  disableConverter
};
