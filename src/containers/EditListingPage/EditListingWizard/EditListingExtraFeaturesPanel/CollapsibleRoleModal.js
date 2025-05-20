import React, { useState } from 'react';
import { Field } from 'react-final-form';

const CollapsibleRoleModal = ({ role, skills, experience, skillSelection, onChange }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="collapsible-modal">
      <button type="button" onClick={() => setOpen(o => !o)}>
        {role} {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className="modal-body">
          <label>Years of Experience</label>
          <Field
            name={`experience_${role}`}
            component="input"
            type="number"
            placeholder="Years"
          />

          <label>Skills</label>
          <Field
            name={`skills_${role}`}
            component="select"
            multiple
          >
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </Field>
        </div>
      )}
    </div>
  );
};
