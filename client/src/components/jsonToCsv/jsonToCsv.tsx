import React, { useState } from 'react';

interface JsonToCsvProps {}

const JsonToCsv: React.FC<JsonToCsvProps> = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [csvOutput, setCsvOutput] = useState<string>('');

  const convertJsonToCsv = (json: string): string => {
    try {
      const arr = JSON.parse(json);
      if (!Array.isArray(arr) || arr.length === 0) return '';

      const headers = Object.keys(arr[0]);
      const csvRows = [
        headers.join(','), // header row
        ...arr.map((row: Record<string, any>) =>
          headers.map(field => JSON.stringify(row[field] ?? '')).join(',')
        ),
      ];
      return csvRows.join('\n');
    } catch (e) {
      return 'Invalid JSON';
    }
  };

  const handleConvert = () => {
    setCsvOutput(convertJsonToCsv(jsonInput));
  };

  return (
    <div>
      <h2>JSON to CSV Converter</h2>
      <textarea
        rows={10}
        cols={50}
        value={jsonInput}
        onChange={e => setJsonInput(e.target.value)}
        placeholder='Paste JSON array here'
      />
      <br />
      <button onClick={handleConvert}>Convert</button>
      <h3>CSV Output</h3>
      <textarea
        rows={10}
        cols={50}
        value={csvOutput}
        readOnly
      />
    </div>
  );
};

export default JsonToCsv;