import css from '../EditListingExtraFeaturesPanel/EditListingExtraFeatureForm.module.css';
import React, { useState, useEffect } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';

// Import util modules
import { FormattedMessage, useIntl } from '../../../../util/reactIntl';
// Import shared components
import { Form, Button, FieldTextInput } from '../../../../components';

const EditListingExtraFeaturesForm = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        formId = 'EditListingExtraFeaturesForm',
        className,
        rootClassName,
        disabled,
        ready,
        handleSubmit,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        autoFocus,
        unitType,
        updateInProgress,
        form,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const intl = useIntl();
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const [editIndex, setEditIndex] = useState(null);

      return (
        <>
          <Form onSubmit={handleSubmit} className={classes}>
            <FieldTextInput
              id={`${formId}.extrafeature`}
              name="extrafeature"
              className={css.input}
              autoFocus={autoFocus}
              label={intl.formatMessage(
                { id: 'EditListingExtraFeaturesForm.minPrice' },
                { unitType }
              )}
              placeholder={intl.formatMessage({
                id: 'EditListingExtraFeaturesForm.priceInputPlaceholder',
              })}
            />
            <Field
              name="newTag"
              render={({ input }) => (
                <div className={css.inputRow}>
                  <FieldTextInput id="newTag" {...input} placeholder="Add a tag" />
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

            <Button
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              ready={submitReady}
            >
              {saveActionMsg}
            </Button>
          </Form>
        </>
      );
    }}
  />
);

export default EditListingExtraFeaturesForm;
