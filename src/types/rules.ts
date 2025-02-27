export type Operator =
  | 'contains_any'
  | 'is_not'
  | 'equals_anything'
  | 'yes'
  | 'no'
  | 'greater_than_equal'
  | 'between'
  | 'less_than';

export type RuleType =
  | 'specific_collections'
  | 'product_tags'
  | 'product_vendors'
  | 'specific_products'
  | 'product_subscribed'
  | 'specific_discount_codes'
  | 'customer_tag'
  | 'past_order_count'
  | 'specific_countries'
  | 'specific_locales'
  | 'cart_value_range'
  | 'count_of_items_in_cart'
  | 'individual_product_count_in_cart';

export interface Rule {
  id: string;
  type: RuleType;
  operator: Operator;
  values: string[];
}

export const RULE_OPERATORS: Record<RuleType, Operator[]> = {
  specific_collections: ['contains_any', 'is_not'],
  product_tags: ['contains_any', 'is_not'],
  product_vendors: ['contains_any', 'is_not'],
  specific_products: ['contains_any', 'is_not'],
  product_subscribed: ['yes', 'no'],
  specific_discount_codes: ['contains_any'],
  customer_tag: ['contains_any', 'is_not'],
  past_order_count: ['greater_than_equal', 'less_than'],
  specific_countries: ['contains_any', 'is_not'],
  specific_locales: ['contains_any', 'is_not'],
  cart_value_range: ['greater_than_equal', 'between', 'less_than'],
  count_of_items_in_cart: ['greater_than_equal', 'between', 'less_than'],
  individual_product_count_in_cart: [
    'greater_than_equal',
    'between',
    'less_than',
  ],
};

export const RULE_CATEGORIES = {
  'Product based': [
    'specific_collections',
    'product_tags',
    'product_vendors',
    'specific_products',
    'product_subscribed',
  ] as RuleType[],
  'Discount code': ['specific_discount_codes'] as RuleType[],
  'Customer specific': ['customer_tag', 'past_order_count'] as RuleType[],
  'Location based': ['specific_countries'] as RuleType[],
  'Language based': ['specific_locales'] as RuleType[],
  'Cart based': [
    'cart_value_range',
    'count_of_items_in_cart',
    'individual_product_count_in_cart',
  ] as RuleType[],
} as const;

export const RULE_PRIORITY: RuleType[] = Object.values(RULE_CATEGORIES).flat();

export const MUTUALLY_EXCLUSIVE_RULES = new Set([
  'specific_collections',
  'specific_products',
]);

export enum RuleTypeEnum {
  SPECIFIC_COLLECTIONS = 'specific_collections',
  PRODUCT_TAGS = 'product_tags',
  PRODUCT_VENDORS = 'product_vendors',
  SPECIFIC_PRODUCTS = 'specific_products',
  PRODUCT_SUBSCRIBED = 'product_subscribed',
  SPECIFIC_DISCOUNT_CODES = 'specific_discount_codes',
  CUSTOMER_TAG = 'customer_tag',
  PAST_ORDER_COUNT = 'past_order_count',
  SPECIFIC_COUNTRIES = 'specific_countries',
  SPECIFIC_LOCALES = 'specific_locales',
  CART_VALUE_RANGE = 'cart_value_range',
  COUNT_OF_ITEMS_IN_CART = 'count_of_items_in_cart',
  INDIVIDUAL_PRODUCT_COUNT_IN_CART = 'individual_product_count_in_cart',
}
