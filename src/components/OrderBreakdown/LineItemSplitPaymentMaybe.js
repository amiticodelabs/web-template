import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY } from '../../util/types';
import { types as sdkTypes } from '../../util/sdkLoader'

import css from './OrderBreakdown.module.css';

const { Money } = sdkTypes;
console.log(sdkTypes, "types")

const LineItemSplitPaymentMaybe = props => {
    const { transaction, intl, isSplitPayment, showSplitBreakdown } = props;

    if (!isSplitPayment || !showSplitBreakdown) {
        return null;
    }

    const { lineItems = [] } = transaction.attributes;
    const currency = transaction.attributes.payinTotal.currency;

    // Find the main unit line item to get the total amount
    const unitLineItem = lineItems.find(
        item =>
            [LINE_ITEM_NIGHT, LINE_ITEM_DAY, 'line-item/hour', 'line-item/fixed'].includes(item.code) && !item.reversal
    );

    if (!unitLineItem || !unitLineItem.meta?.splitPaymentMetadata) {
        return null;
    }

    const { firstHalf, secondHalf } = unitLineItem.meta.splitPaymentMetadata;

    // Create proper Money objects for formatting
    const firstHalfMoney = new Money(firstHalf, currency);
    const secondHalfMoney = new Money(secondHalf, currency);

    const formatPrice = moneyObject => formatMoney(intl, moneyObject);

    return (
        <div className={css.lineItem}>
            <div className={css.splitPaymentContainer}>
                <div className={css.splitPaymentItem}>
                    <span className={css.itemLabel}>
                        <FormattedMessage id="OrderBreakdown.splitPayment.payNow" />
                    </span>
                    <span className={css.itemValue}>
                        {formatPrice(firstHalfMoney)}
                    </span>
                </div>
                <div className={css.splitPaymentItem}>
                    <span className={css.itemLabel}>
                        <FormattedMessage id="OrderBreakdown.splitPayment.payLater" />
                    </span>
                    <span className={css.itemValue}>
                        {formatPrice(secondHalfMoney)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LineItemSplitPaymentMaybe;
