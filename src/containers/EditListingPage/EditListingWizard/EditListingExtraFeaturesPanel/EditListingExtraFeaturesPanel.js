import React from 'react';
import classNames from 'classnames';
import css from '../EditListingDetailsPanel/EditListingDetailsPanel.module.css';
import {
  isFieldForCategory,
  isFieldForListingType,
  pickCategoryFields,
} from '../../../../util/fieldHelpers';
import {
  EXTENDED_DATA_SCHEMA_TYPES,
  LISTING_STATE_DRAFT,
  SCHEMA_TYPE_ENUM,
  SCHEMA_TYPE_MULTI_ENUM,
} from '../../../../util/types';
import { H3, ListingLink } from '../../../../components';
import { FormattedMessage } from '../../../../util/reactIntl';
import { isBookingProcessAlias } from '../../../../transactions/transaction';
import EditListingExtraFeaturesForm from './EditListingExtraFeaturesForm';

const hasSetListingType = publicData => {
  const { listingType, transactionProcessAlias, unitType } = publicData;
  const existingListingTypeInfo = { listingType, transactionProcessAlias, unitType };

  return {
    hasExistingListingType: !!listingType && !!transactionProcessAlias && !!unitType,
    existingListingTypeInfo,
  };
};
const getTransactionInfo = (listingTypes, existingListingTypeInfo = {}, inlcudeLabel = false) => {
  const { listingType, transactionProcessAlias, unitType } = existingListingTypeInfo;

  if (listingType && transactionProcessAlias && unitType) {
    return { listingType, transactionProcessAlias, unitType };
  } else if (listingTypes.length === 1) {
    const { listingType: type, label, transactionType } = listingTypes[0];
    const { alias, unitType: configUnitType } = transactionType;
    const labelMaybe = inlcudeLabel ? { label: label || type } : {};
    return {
      listingType: type,
      transactionProcessAlias: alias,
      unitType: configUnitType,
      ...labelMaybe,
    };
  }
  return {};
};
const initialValuesForListingFields = (
  data,
  targetScope,
  targetListingType,
  targetCategories,
  listingFieldConfigs
) => {
  const targetCategoryIds = Object.values(targetCategories);

  return listingFieldConfigs.reduce((fields, fieldConfig) => {
    const { key, scope = 'public', schemaType, enumOptions } = fieldConfig || {};
    const namespacePrefix = scope === 'public' ? `pub_` : `priv_`;
    const namespacedKey = `${namespacePrefix}${key}`;

    const isKnownSchemaType = EXTENDED_DATA_SCHEMA_TYPES.includes(schemaType);
    const isEnumSchemaType = schemaType === SCHEMA_TYPE_ENUM;
    const shouldHaveValidEnumOptions =
      !isEnumSchemaType ||
      (isEnumSchemaType && !!enumOptions?.find(conf => conf.option === data?.[key]));
    const isTargetScope = scope === targetScope;
    const isTargetListingType = isFieldForListingType(targetListingType, fieldConfig);
    const isTargetCategory = isFieldForCategory(targetCategoryIds, fieldConfig);

    if (
      isKnownSchemaType &&
      isTargetScope &&
      isTargetListingType &&
      isTargetCategory &&
      shouldHaveValidEnumOptions
    ) {
      const fieldValue = data?.[key] != null ? data[key] : null;
      return { ...fields, [namespacedKey]: fieldValue };
    }
    return fields;
  }, {});
};

const getInitialValues = (
  props,
  existingListingTypeInfo,
  listingTypes,
  listingFields,
  listingCategories,
  categoryKey
) => {
  const { description, title, publicData, privateData } = props?.listing?.attributes || {};
  const { listingType, extrafeature } = publicData;

  const nestedCategories = pickCategoryFields(publicData, categoryKey, 1, listingCategories);
  // Initial values for the form
  return {
    title,
    description,
    extrafeature,

    ...nestedCategories,
    // Transaction type info: listingType, transactionProcessAlias, unitType
    ...getTransactionInfo(listingTypes, existingListingTypeInfo),
    ...initialValuesForListingFields(
      publicData,
      'public',
      listingType,
      nestedCategories,
      listingFields
    ),
    ...initialValuesForListingFields(
      privateData,
      'private',
      listingType,
      nestedCategories,
      listingFields
    ),
  };
};

const EditListingExtraFeaturesPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    // onListingTypeChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    config,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const { publicData, state } = listing?.attributes || {};
  const listingTypes = config.listing.listingTypes;
  const listingFields = config.listing.listingFields;
  const listingCategories = config.categoryConfiguration.categories;
  const categoryKey = config.categoryConfiguration.key;
  const currentTags = listing?.attributes?.publicData?.tags || []; //NEW

  const { hasExistingListingType, existingListingTypeInfo } = hasSetListingType(publicData);
  const hasValidExistingListingType =
    hasExistingListingType &&
    !!listingTypes.find(conf => {
      const listinTypesMatch = conf.listingType === existingListingTypeInfo.listingType;
      const unitTypesMatch = conf.transactionType?.unitType === existingListingTypeInfo.unitType;
      return listinTypesMatch && unitTypesMatch;
    });
  const initialValues = getInitialValues(
    props,
    existingListingTypeInfo,
    listingTypes,
    listingFields,
    listingCategories,
    categoryKey,
    // tags
  );

  const noListingTypesSet = listingTypes?.length === 0;
  const hasListingTypesSet = listingTypes?.length > 0;
  const isPublished = listing?.id && state !== LISTING_STATE_DRAFT;

  return (
    <div className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingExtraFeaturesPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingExtraFeaturesPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>
      {true ? (
        <EditListingExtraFeaturesForm
          className={css.form}
          initialValues={{
            relatedRoles: listing?.attributes?.publicData?.relatedRoles || '',
            Experience: listing?.attributes?.publicData?.Experience || '',
            roleData: listing?.attributes?.publicData?.roleData || '',
          }}
          
          saveActionMsg={submitButtonText}
          onSubmit={values => {
            const { relatedRoles, Experience, roleData } = values;


            const updateValues = {
              publicData: {
                relatedRoles,
                Experience,
                roleData
              },
            };
            onSubmit(updateValues);
          }}
          selectableListingTypes={listingTypes.map(conf => getTransactionInfo([conf], {}, true))}
          hasExistingListingType={hasExistingListingType}
          selectableCategories={listingCategories}
          pickSelectedCategories={values =>
            pickCategoryFields(values, categoryKey, 1, listingCategories)
          }
          categoryPrefix={categoryKey}
          //   onListingTypeChange={onListingTypeChange}
          listingFieldsConfig={listingFields}
          listingCurrency={listing?.attributes?.price?.currency}
          marketplaceCurrency={config.currency}
          marketplaceName={config.marketplaceName}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
          autoFocus
        />
      ) : (
        <ErrorMessage
          marketplaceName={config.marketplaceName}
          noListingTypesSet={noListingTypesSet}
          invalidExistingListingType={!hasValidExistingListingType}
        />
      )}
      {/* <EditTagListForm initialValues={{ tags: currentTags }} onSubmit={handleSubmit} {...rest} /> */}
    </div>
  );
};

export default EditListingExtraFeaturesPanel;
