import React, { useState } from 'react';

const initialData = {
    "rows": [
      {
        "id": "electronics",
        "label": "Electronics",
        "value": 1500, //this value needs to be calculated from the children values (800+700)
        "children": [
          {
            "id": "phones",
            "label": "--Phones",
            "value": 800
          },
          {
            "id": "laptops",
            "label": "--Laptops",
            "value": 700
          }
        ]
      },
      {
        "id": "furniture",
        "label": "Furniture",
        "value": 1000, //this need to be calculated from the children values (300+700)
        "children": [
          {
            "id": "tables",
            "label": "--Tables",
            "value": 300
          },
          {
            "id": "chairs",
            "label": "--Chairs",
            "value": 700
          }
        ]
      }
    ]
  }

const Table = () => {
  const [data, setData] = useState(initialData);

  const handlePercentageChange = (id, percentage) => {
    const newData = JSON.parse(JSON.stringify(data));
    const row = findRowById(newData.rows, id);
    const originalValue = row.value;
    row.value = Math.round(originalValue * (1 + percentage / 100));
    row.variance = ((row.value - originalValue) / originalValue) * 100;
    updateParentValues(newData);
    setData(newData);
  };

  const handleValueChange = (id, newValue) => {
    const newData = JSON.parse(JSON.stringify(data));
    const row = findRowById(newData.rows, id);
    const originalValue = row.value;
    row.value = newValue;
    row.variance = ((newValue - originalValue) / originalValue) * 100;
    updateParentValues(newData);
    setData(newData);
  };

  const findRowById = (rows, id) => {
    for (let row of rows) {
      if (row.id === id) {
        return row;
      }
      if (row.children) {
        const childRow = findRowById(row.children, id);
        if (childRow) {
          return childRow;
        }
      }
    }
    return null;
  };

  const updateParentValues = (data) => {
    data.rows.forEach(row => {
      if (row.children) {       
        row.value = row.children.reduce((sum, child) => sum + child.value, 0);
        console.log(row.value,"row.children");
      }
    });
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>
        {data.rows.map(row => (
          <Row key={row.id} row={row} onPercentageChange={handlePercentageChange} onValueChange={handleValueChange} />
        ))}
      </tbody>
    </table>
  );
};

const Row = ({ row, onPercentageChange, onValueChange }) => {
  const [input, setInput] = useState('');

  return (
    <>
   
      <tr>
        <td>{row.label}</td>
        <td>{row.value}</td>
        <td>
          <input type="number" value={input} onChange={(e) => setInput(e.target.value)} />
        </td>
        <td>
          <button onClick={() => onPercentageChange(row.id, parseFloat(input))}>Allocation %</button>
        </td>
        <td>
          <button onClick={() => onValueChange(row.id, parseFloat(input))}>Allocation Val</button>
        </td>
        <td>{row.variance ? row.variance.toFixed(2) : 0}%</td>
      </tr>
      {row.children && row.children.map(child => (
        <Row key={child.id} row={child} onPercentageChange={onPercentageChange} onValueChange={onValueChange} />
      ))}
     
    </>
  );
};

export default Table;