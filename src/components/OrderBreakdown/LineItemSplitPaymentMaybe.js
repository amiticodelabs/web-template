import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, LISTING_UNIT_TYPES, LINE_ITEM_FIXED, LINE_ITEM_HOUR, DATE_TYPE_DATETIME, DATE_TYPE_DATE } from '../../util/types';
import { types as sdkTypes } from '../../util/sdkLoader'

import css from './OrderBreakdown.module.css';
import classNames from 'classnames';
import LineItemBookingPeriod from './LineItemBookingPeriod';
import LineItemBasePriceMaybe from './LineItemBasePriceMaybe';
import LineItemShippingFeeMaybe from './LineItemShippingFeeMaybe';
import LineItemPickupFeeMaybe from './LineItemPickupFeeMaybe';
import LineItemUnknownItemsMaybe from './LineItemUnknownItemsMaybe';
import LineItemSubTotalMaybe from './LineItemSubTotalMaybe';
import LineItemRefundMaybe from './LineItemRefundMaybe';
import LineItemCustomerCommissionMaybe from './LineItemCustomerCommissionMaybe';
import LineItemCustomerCommissionRefundMaybe from './LineItemCustomerCommissionRefundMaybe';
import LineItemProviderCommissionMaybe from './LineItemProviderCommissionMaybe';
import LineItemProviderCommissionRefundMaybe from './LineItemProviderCommissionRefundMaybe';
import LineItemTotalPrice from './LineItemTotalPrice';

const { Money } = sdkTypes;
console.log(sdkTypes, "types")

const LineItemSplitPaymentMaybe = props => {
    const { transaction, intl, rootClassName, className, booking, userRole, timeZone , marketplaceCurrency , marketplaceName} = props;
    console.log(transaction, "tra")

    // if (!isSplitPayment || !showSplitBreakdown) {
    //     return null;
    // }

    // const { lineItems = [] } = transaction?.attributes;
    const currency = transaction.attributes.payinTotal.currency;
    // console.log(lineItems, "lineItems")

    // if (!splitPaymentLineItem) {
    //     return null;
    // }



    const allLineItems = transaction.attributes.lineItems || [];
    // We'll show only line-items that are specific for the current userRole (customer vs provider)
    const lineItems = allLineItems.filter(lineItem => lineItem.includeFor.includes(userRole));
    const unitLineItem = lineItems.find(
        item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
    );
    // Line-item code that matches with base unit: day, night, hour, fixed, item
    const lineItemUnitType = unitLineItem?.code;
    const dateType = [LINE_ITEM_HOUR, LINE_ITEM_FIXED].includes(lineItemUnitType)
        ? DATE_TYPE_DATETIME
        : DATE_TYPE_DATE;

    // Find the main unit line item to get the total amount
    const splitPaymentLineItem = lineItems.find(
        item => item.code === 'line-item/split-payment' && !item.reversal
    );

    const classes = classNames(rootClassName || css.root, className);
    const isRemainingPayup = splitPaymentLineItem.splitPaymentMetadata?.isRemainingPayup;
    const amount = splitPaymentLineItem.lineTotal?.amount;
    const money = new Money(amount, currency);
    const formatPrice = moneyObject => formatMoney(intl, moneyObject);
    const isCustomer = userRole === 'customer';
    const isProvider = userRole === 'provider';


    return (
        <div className={css.lineItem}>
            <div className={css.splitPaymentContainer}>
                <div className={css.splitPaymentItem}>
                    <span className={css.itemLabel}>
                        <FormattedMessage id={isRemainingPayup ? "OrderBreakdown.splitPayment.payLater" : "OrderBreakdown.splitPayment.payNow"} />
                    </span>
                    <span className={css.itemValue}>
                        {formatPrice(money)}
                    </span>
                </div>
                <div className={classes}>
                    <LineItemBookingPeriod
                        booking={booking}
                        code={lineItemUnitType}
                        dateType={dateType}
                        timeZone={timeZone}
                    />

                    <LineItemBasePriceMaybe lineItems={lineItems} code={lineItemUnitType} intl={intl} />
                    <LineItemShippingFeeMaybe lineItems={lineItems} intl={intl} />
                    <LineItemPickupFeeMaybe lineItems={lineItems} intl={intl} />
                    <LineItemUnknownItemsMaybe lineItems={lineItems} isProvider={isProvider} intl={intl} />

                    <LineItemSubTotalMaybe
                        lineItems={lineItems}
                        code={lineItemUnitType}
                        userRole={userRole}
                        intl={intl}
                        marketplaceCurrency={currency}
                    />
                    <LineItemRefundMaybe lineItems={lineItems} intl={intl} marketplaceCurrency={currency} />

                    <LineItemCustomerCommissionMaybe
                        lineItems={lineItems}
                        isCustomer={isCustomer}
                        marketplaceName={marketplaceName}
                        intl={intl}
                    />
                    <LineItemCustomerCommissionRefundMaybe
                        lineItems={lineItems}
                        isCustomer={isCustomer}
                        marketplaceName={marketplaceName}
                        intl={intl}
                    />

                    <LineItemProviderCommissionMaybe
                        lineItems={lineItems}
                        isProvider={isProvider}
                        marketplaceName={marketplaceName}
                        intl={intl}
                    />
                    <LineItemProviderCommissionRefundMaybe
                        lineItems={lineItems}
                        isProvider={isProvider}
                        marketplaceName={marketplaceName}
                        intl={intl}
                    />

                    <LineItemTotalPrice transaction={transaction} isProvider={isProvider} intl={intl} />

                    {/* {hasCommissionLineItem ? (
                        <span className={css.feeInfo}>
                            <FormattedMessage id="OrderBreakdown.commissionFeeNote" />
                        </span>
                    ) : null} */}
                </div>
            </div>
        </div>
    );
};

export default LineItemSplitPaymentMaybe;