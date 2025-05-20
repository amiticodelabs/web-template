import css from '../EditListingExtraFeaturesPanel/EditListingExtraFeatureForm.module.css';
import React, { useState, useEffect } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';

// Import util modules
import { FormattedMessage, useIntl } from '../../../../util/reactIntl';
// Import shared components
import { Form, Button, FieldTextInput, FieldCheckboxGroup } from '../../../../components';
import FieldMultiSelect from './FieldMultiSelect';

const SKILL_OPTIONS = {
  'front-end': [{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }],
  'back-end': [{ value: 'node', label: 'Node.js' }, { value: 'django', label: 'Django' }],
  'full-stack': [{ value: 'typescript', label: 'TypeScript' }],
  'java': [{ value: 'spring', label: 'Spring Boot' }, { value: 'hibernate', label: 'Hibernate' }],
};

const EditListingExtraFeaturesForm = props => (
  <FinalForm
    {...props}
    keepDirtyOnReinitialize={true}
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
        values,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const intl = useIntl();
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const roleOptions = [
        { value: 'front-end', label: 'front-end' },
        { value: 'back-end', label: 'back-end' },
        { value: 'full-stack', label: 'full-stack' },
        { value: 'java', label: 'java' },
      ];
      const selectedRoles = values.relatedRoles || [];
      const [expandedRoles, setExpandedRoles] = useState([]);
      const toggleRoleSection = role => {
        setExpandedRoles(
          prev =>
            prev.includes(role)
              ? prev.filter(r => r !== role) // collapse it
              : [...prev, role] // expand it
        );
      };

      return (
        <>
          <Form onSubmit={handleSubmit} className={classes}>
            <FieldTextInput
              id={`${formId}.Experience`}
              name="Experience"
              className={css.input}
              autoFocus={autoFocus}
              label="Highest Experience"
              placeholder="What Experience do you have"
            />

            <Field
              name="relatedRoles"
              component={FieldMultiSelect}
              options={roleOptions}
              placeholder="Select related roles..."
            />

            {selectedRoles.map(role => (
              <div key={role} className={css.roleSection}>
                <div className={css.roleHeader} onClick={() => toggleRoleSection(role)}>
                  <strong>{role}</strong>
                  <span>{expandedRoles.includes(role) ? '▲' : '▼'}</span>
                </div>

                {expandedRoles.includes(role) && (
                  <div className={css.roleContent}>
                    <Field
                      name={`roleData.${role}.skills`}
                      component={FieldMultiSelect}
                      options={SKILL_OPTIONS[role] || []}
                      placeholder={`Select skills for ${role}`}
                    />

                    {/* For each selected skill, show an experience input */}
                    {values.roleData &&
                      values.roleData[role] &&
                      values.roleData[role].skills &&
                      Array.isArray(values.roleData[role].skills) &&
                      values.roleData[role].skills.map(skill => (
                        <FieldTextInput
                          key={`${role}.${skill}.experience`}
                          name={`roleData.${role}.skillsExperience.${skill}`}
                          id={`roleData.${role}.skillsExperience.${skill}`}
                          label={`Years of experience in ${skill}`}
                          type="number"
                          placeholder={`e.g., 3`}
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}

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
