import React, { useState } from 'react';

const getValueType = (value: any) => {
  if (typeof value === 'object') {
    const stringified = JSON.stringify(value);
    if (stringified.includes('[')) {
      return '[]';
    }
    if (stringified.includes('{')) {
      return 'Record<string, unknown>';
    }
    if (stringified.includes('null')) {
      return 'null';
    }
  }
  return typeof value;
};

function removeOutsideText(text: string) {
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1) {
    return text; // No braces found
  }

  return text.slice(startIndex, endIndex + 1);
}

function addQuotesToKeys(inputString: string) {
  const regex = /(\w+)(?=:)/g;
  return inputString.replace(regex, '"$1"');
}

const parseIntoInterface = (input: JSON) => {
  let outputInterfaceString = '';

  Object.entries(input).map(([key, value]) => {
    const valueType = getValueType(value);
    const lastIndexOfSemicolon = outputInterfaceString.lastIndexOf(';');

    if (lastIndexOfSemicolon === -1) {
      outputInterfaceString = `{ ${key}: ${valueType}; }`;
    } else {
      const firstPart = outputInterfaceString.slice(
        0,
        lastIndexOfSemicolon + 1
      );
      const addendum = `${key}: ${valueType};`;
      const result = `${firstPart} ${addendum} }`;
      outputInterfaceString = result;
    }
    return false;
  });
  const completedInterface = `interface SampleOutputInterface ${outputInterfaceString}`;
  const lineBreakAfterFirstBrace = completedInterface.replace('{', '{\n');
  const stringWithLineBreaks = lineBreakAfterFirstBrace.replaceAll(';', ';\n');

  return stringWithLineBreaks;
};

function App() {
  const [jsonInputText, setJsonInputText] = useState('');
  const [jsonOutputText, setJsonOutputText] = useState('');

  const [jsObjectInputText, setJsObjectInputText] = useState('');
  const [jsObjectOutputText, setJsObjectOutputText] = useState('');

  const handleJsonParse = () => {
    if (jsonInputText) {
      try {
        const parsedJson = JSON.parse(jsonInputText);
        const parsedString = parseIntoInterface(parsedJson);
        setJsonOutputText(parsedString);
      } catch (e) {
        console.error(e);
        setJsObjectOutputText('Object is not a valid JSON object');
      }
    }
  };

  const handleJsParse = () => {
    if (jsObjectInputText) {
      try {
        const one = removeOutsideText(jsObjectInputText);
        const result = addQuotesToKeys(one);
        const parsedJson = JSON.parse(result);
        const parsedString = parseIntoInterface(parsedJson);
        setJsonOutputText(parsedString);
      } catch (e) {
        setJsonOutputText('Object is not a valid JS object');
      }
    }
  };

  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        <textarea
          placeholder="Paste JSON object here"
          value={jsonInputText}
          onChange={(e) => setJsonInputText(e.target.value)}
          rows={10}
        />
        <button onClick={handleJsonParse}>Parse</button>
        <div
          style={{
            whiteSpace: 'pre',
          }}
        >
          {jsonOutputText}
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <textarea
          placeholder="Paste JS object here"
          value={jsObjectInputText}
          onChange={(e) => setJsObjectInputText(e.target.value)}
          rows={10}
        />
        <button onClick={handleJsParse}>Parse</button>
        <div
          style={{
            whiteSpace: 'pre',
          }}
        >
          {jsObjectOutputText}
        </div>
      </div>
    </div>
  );
}

export default App;
