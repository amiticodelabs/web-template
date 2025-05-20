import React from 'react';
import Select from 'react-select';

const FieldMultiSelect = ({ input, options, placeholder, meta }) => {
  // Convert selected values to full option objects
  const selectedOptions = options.filter(option =>
    (input.value || []).includes(option.value)
  );

  const handleChange = selected => {
    input.onChange(selected ? selected.map(item => item.value) : []);
  };

  return (
    <div>
      <Select
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
      />
      {meta.touched && meta.error ? (
        <div style={{ color: 'red' }}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FieldMultiSelect;
