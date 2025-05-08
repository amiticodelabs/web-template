import css from '../EditListingDetailsPanel/EditListingDetailsForm.module.css';
import React, { useState, useEffect } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

// Import util modules
import { FormattedMessage, useIntl } from '../../../../util/reactIntl';
// Import shared components
import {
  Form,
  Button,
  FieldSelect,
  FieldTextInput,
  Heading,
  CustomExtendedDataField,
} from '../../../../components';

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
        updateInProgress,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const intl = useIntl();
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
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
      );
    }}
  />
);

export default EditListingExtraFeaturesForm;
