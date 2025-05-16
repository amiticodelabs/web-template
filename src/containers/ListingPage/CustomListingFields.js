import React from 'react';

// Utils
import { SCHEMA_TYPE_MULTI_ENUM, SCHEMA_TYPE_TEXT, SCHEMA_TYPE_YOUTUBE } from '../../util/types';
import {
  isFieldForCategory,
  pickCategoryFields,
  pickCustomFieldProps,
} from '../../util/fieldHelpers.js';

import SectionDetailsMaybe from './SectionDetailsMaybe';
import SectionMultiEnumMaybe from './SectionMultiEnumMaybe';
import SectionTextMaybe from './SectionTextMaybe';
import SectionYoutubeVideoMaybe from './SectionYoutubeVideoMaybe';

/**
 * Renders custom listing fields.
 * - SectionDetailsMaybe is used if schemaType is 'enum', 'long', or 'boolean'
 * - SectionMultiEnumMaybe is used if schemaType is 'multi-enum'
 * - SectionTextMaybe is used if schemaType is 'text'
 *
 * @param {*} props include publicData, metadata, listingFieldConfigs, categoryConfiguration
 * @returns React.Fragment containing aforementioned components
 */
const CustomListingFields = props => {
  const { publicData, metadata, listingFieldConfigs, categoryConfiguration } = props;

  // This determines which categories are selected in the listing (e.g., “Cars → SUVs”), so the form only shows relevant fields.
  const { key: categoryPrefix, categories: listingCategoriesConfig } = categoryConfiguration;
  const categoriesObj = pickCategoryFields(publicData, categoryPrefix, 1, listingCategoriesConfig);
  const currentCategories = Object.values(categoriesObj);

  //Each field config is checked to see if it should be shown for the current category.
  const isFieldForSelectedCategories = fieldConfig => {
    const isTargetCategory = isFieldForCategory(currentCategories, fieldConfig);
    return isTargetCategory;
  };

  //This utility function:
// Filters fields that match the selected categories
// Picks out the data needed to render them (schema type, value, label, etc.)
  const propsForCustomFields =
    pickCustomFieldProps(
      publicData,
      metadata,
      listingFieldConfigs,
      'listingType',
      isFieldForSelectedCategories
    ) || [];

  return (
    <>
      <SectionDetailsMaybe {...props} isFieldForCategory={isFieldForSelectedCategories} />
      {/* Based on the schema type (multi-enum, text, YouTube), it renders the correct UI component for that field. */}
      {propsForCustomFields.map(customFieldProps => {
        const { schemaType, key, ...fieldProps } = customFieldProps;
        return schemaType === SCHEMA_TYPE_MULTI_ENUM ? (
          <SectionMultiEnumMaybe key={key} {...fieldProps} />
        ) : schemaType === SCHEMA_TYPE_TEXT ? (
          <SectionTextMaybe key={key} {...fieldProps} />
        ) : schemaType === SCHEMA_TYPE_YOUTUBE ? (
          <SectionYoutubeVideoMaybe key={key} {...fieldProps} />
        ) : null;
      })}
    </>
  );
};

export default CustomListingFields;
