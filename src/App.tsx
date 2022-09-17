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

const parseJsonIntoInterface = (inputJson: string) => {
  const parsedJson = JSON.parse(inputJson);
  let outputInterfaceString = '';

  Object.entries(parsedJson).map(([key, value]) => {
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
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleJsonParse = () => {
    if (inputText) {
      try {
        const parsedString = parseJsonIntoInterface(inputText);
        setOutputText(parsedString);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <textarea
        placeholder="Paste JSON here"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={10}
      />
      <button onClick={handleJsonParse}>Parse</button>
      <div
        style={{
          whiteSpace: 'pre',
        }}
      >
        {outputText}
      </div>
    </div>
  );
}

export default App;
