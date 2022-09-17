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
        setJsonOutputText('');
      }
    }
  };

  const handleJsParse = () => {
    if (jsObjectInputText) {
      try {
        const removedWhitespace = jsObjectInputText.replaceAll(' ', '');
        const addQuotesFirstPart = removedWhitespace.replaceAll('{', '{"');
        const addQuotesSecondPart = addQuotesFirstPart.replaceAll(':', '":');
        const addQuotesThirdPart = addQuotesSecondPart.replaceAll(',', ',"');
        const parsedJson = JSON.parse(addQuotesThirdPart);
        const parsed = parseIntoInterface(parsedJson);
        setJsObjectOutputText(parsed);
      } catch (e) {
        console.error(e);
        setJsObjectOutputText('');
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
