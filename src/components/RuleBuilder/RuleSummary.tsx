import { Rule, RuleTypeEnum } from '@/types/rules';

const formatRule = (rule: Rule) => {
  const { type, operator, values } = rule;
  const isNot = operator.includes('is_not');
  const isBetween = operator === 'between';
  const formattedValues = values.length ? values.join(', ') : 'None';

  const formatInclusion = (includedText: string, excludedText: string) =>
    values.length
      ? isNot
        ? excludedText
        : includedText
      : `No ${includedText}`;

  switch (type) {
    case RuleTypeEnum.SPECIFIC_COLLECTIONS:
      return formatInclusion(
        `${formattedValues} included`,
        `${formattedValues} excluded`
      );
    case RuleTypeEnum.PRODUCT_TAGS:
      return formatInclusion(
        `Include products with tags: ${formattedValues}`,
        `Exclude products with tags: ${formattedValues}`
      );
    case RuleTypeEnum.PRODUCT_VENDORS:
      return formatInclusion(
        `Include products from vendors: ${formattedValues}`,
        `Exclude products from vendors: ${formattedValues}`
      );
    case RuleTypeEnum.SPECIFIC_PRODUCTS:
      return formatInclusion(
        `Include products: ${formattedValues}`,
        `Exclude products: ${formattedValues}`
      );
    case RuleTypeEnum.PRODUCT_SUBSCRIBED:
      return operator === 'yes'
        ? 'Subscribed to product updates'
        : 'Not subscribed to product updates';
    case RuleTypeEnum.SPECIFIC_DISCOUNT_CODES:
      return `Discount codes: ${formattedValues}`;
    case RuleTypeEnum.CUSTOMER_TAG:
      return `Customer tags: ${formattedValues}`;
    case RuleTypeEnum.PAST_ORDER_COUNT:
      return `Past order count ${
        operator === 'greater_than_equal' ? '>=' : '<'
      } ${formattedValues}`;
    case RuleTypeEnum.SPECIFIC_COUNTRIES:
      return formatInclusion(
        `Include countries: ${formattedValues}`,
        `Exclude countries: ${formattedValues}`
      );
    case RuleTypeEnum.SPECIFIC_LOCALES:
      return formatInclusion(
        `Include locales: ${formattedValues}`,
        `Exclude locales: ${formattedValues}`
      );
    case RuleTypeEnum.CART_VALUE_RANGE:
      return isBetween
        ? `Cart value between: ${values[0]} and ${values[1] ?? 'unspecified'}`
        : `Cart value ${
            operator === 'greater_than_equal' ? '>=' : '<'
          } ${formattedValues}`;
    case RuleTypeEnum.COUNT_OF_ITEMS_IN_CART:
      return isBetween
        ? `Count of items in cart between: ${values[0]} and ${
            values[1] ?? 'unspecified'
          }`
        : `Count of items in cart ${
            operator === 'greater_than_equal' ? '>=' : '<'
          } ${formattedValues}`;
    case RuleTypeEnum.INDIVIDUAL_PRODUCT_COUNT_IN_CART:
      return isBetween
        ? `Individual product count in cart between: ${values[0]} and ${
            values[1] ?? 'unspecified'
          }`
        : `Individual product count in cart ${
            operator === 'greater_than_equal' ? '>=' : '<'
          } ${formattedValues}`;
    default:
      return 'Unknown rule';
  }
};

const RuleSummary = ({ rules }: { rules: Rule[] }) => (
  <div className='bg-white shadow-md rounded-lg p-4 w-full mt-4 lg:mt-0 lg:w-[25%] lg:min-w-[300px] border'>
    <h2 className='text-lg font-semibold'>Summary</h2>
    <hr className='my-2' />
    <h3 className='text-md font-semibold'>Eligibility Rules</h3>
    <ul className='list-disc pl-5 mt-2 text-gray-700'>
      {rules.length ? (
        rules.map((rule) => <li key={rule.id}>{formatRule(rule)}</li>)
      ) : (
        <li>No eligibility rules defined</li>
      )}
    </ul>
  </div>
);

export default RuleSummary;
