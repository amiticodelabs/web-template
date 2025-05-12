import React, { useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Form, Button, FieldTextInput } from '../../components'; // Adjust path if needed
import css from '././FieldArrayTry.module.css'; // Add your CSS

const EditTagListForm = props => {
  const [editIndex, setEditIndex] = useState(null);

  const onSubmit = values => {
    console.log('Final values:', values.tags);
  };

  return (
    <FinalForm
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit, values, form }) => {
        const tags = values.tags || [];

        return (
          <Form onSubmit={handleSubmit}>
            <Field
              name="newTag"
              render={({ input }) => (
                <div className={css.inputRow}>
                  <FieldTextInput
                    id="newTag"
                    {...input}
                    placeholder="Add a tag"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (input.value?.trim()) {
                        if (editIndex !== null) {
                          form.change(`tags[${editIndex}]`, input.value);
                          setEditIndex(null);
                        } else {
                          form.mutators.push('tags', input.value);
                        }
                        form.change('newTag', '');
                      }
                    }}
                  >
                    {editIndex !== null ? 'Update' : 'Add'}
                  </Button>
                </div>
              )}
            />

            <FieldArray name="tags">
              {({ fields }) =>
                fields.map((name, index) => (
                  <div key={name} className={css.tagItem}>
                    <span>{fields.value[index]}</span>
                    <Button
                      type="button"
                      onClick={() => {
                        form.change('newTag', fields.value[index]);
                        setEditIndex(index);
                      }}
                    >
                      Edit
                    </Button>
                    <Button type="button" onClick={() => fields.remove(index)}>
                      Delete
                    </Button>
                  </div>
                ))
              }
            </FieldArray>

            <Button type="submit" style={{ marginTop: '20px' }}>
              Submit
            </Button>
          </Form>
        );
      }}
    />
  );
};

export default EditTagListForm;
