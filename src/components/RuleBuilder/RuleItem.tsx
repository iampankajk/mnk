import {
  MUTUALLY_EXCLUSIVE_RULES,
  Rule,
  RULE_CATEGORIES,
  RULE_OPERATORS,
  RuleTypeEnum,
} from '@/types/rules';
import React from 'react';
import { OperatorSelect, RuleSelect } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SearchMultiSelect from '@/components/ui/search';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define a set of rule types that require multi-select inputs
const MULTISELECT_RULE_TYPES = new Set([
  'specific_collections',
  'product_tags',
  'product_vendors',
  'specific_products',
]);

export const RuleItem = React.memo(
  ({
    rule,
    index,
    rules,
    updateRule,
    removeRule,
    addValueToRule,
    removeValueFromRule,
    getSelectedCount,
  }: {
    rule: Rule;
    index: number;
    rules: Rule[];
    updateRule: (
      ruleId: string,
      updates: Partial<Rule>,
      resetOperator?: boolean
    ) => void;
    removeRule: (ruleId: string) => void;
    addValueToRule: (ruleId: string, value: string) => void;
    removeValueFromRule: (ruleId: string, value: string) => void;
    getSelectedCount: any;
  }) => {
    // Check if the current rule type requires a multi-select input
    const needsMultiselect = MULTISELECT_RULE_TYPES.has(rule.type);

    // Get the length of values in the previous rule (if exists) to adjust spacing
    const previousRuleValuesLength = rules[index - 1]?.values.length || 0;

    return (
      <div className='relative pl-4'>
        {/* Display the "AND" connector between rules when more than one exists */}
        {index > 0 && (
          <div
            className={`absolute z-10 left-[-15px] border-l-2 border-t-2 border-b-2 flex items-center my-2 ${
              previousRuleValuesLength > 0
                ? 'h-[5.5rem] top-[-4.5rem]'
                : 'h-[3.5rem] top-[-2.5rem]'
            }`}
          >
            <span className='text-sm font-medium text-gray-500'>AND</span>
          </div>
        )}

        <div className='flex items-center gap-4 mb-2'>
          {/* Dropdown to select rule type */}
          <RuleSelect
            rule={rule}
            updateRule={updateRule}
            RULE_CATEGORIES={RULE_CATEGORIES}
            isRuleDisabled={(type) => rules.some((r) => r.type === type)}
          />

          {/* Operator selection dropdown, disabled for specific rule types */}
          {rule.type !== RuleTypeEnum.SPECIFIC_DISCOUNT_CODES &&
            rule.type !== RuleTypeEnum.CUSTOMER_TAG && (
              <OperatorSelect
                rule={rule}
                updateRule={updateRule}
                RULE_OPERATORS={RULE_OPERATORS}
                isOperatorDisabled={(type, operator) => {
                  if (!MUTUALLY_EXCLUSIVE_RULES.has(type)) return false;

                  const otherRuleType =
                    type === 'specific_collections'
                      ? 'specific_products'
                      : 'specific_collections';
                  const otherRule = rules.find((r) => r.type === otherRuleType);

                  if (otherRule) {
                    return operator === otherRule.operator;
                  }

                  return false;
                }}
              />
            )}

          {/* Input fields based on the rule type */}
          {(rule.type === RuleTypeEnum.CART_VALUE_RANGE ||
            rule.type === RuleTypeEnum.COUNT_OF_ITEMS_IN_CART ||
            rule.type === RuleTypeEnum.INDIVIDUAL_PRODUCT_COUNT_IN_CART) &&
          rule.operator === 'between' ? (
            // Input fields for range values (Min & Max)
            <>
              <Input
                type='number'
                className='border rounded px-3 py-2 w-24'
                placeholder='Min'
                value={rule.values[0] || ''}
                onChange={(e) =>
                  updateRule(rule.id, {
                    values: [e.target.value, rule.values[1] || ''],
                  })
                }
              />
              <Input
                type='number'
                className='border rounded px-3 py-2 w-24'
                placeholder='Max'
                value={rule.values[1] || ''}
                onChange={(e) =>
                  updateRule(rule.id, {
                    values: [rule.values[0] || '', e.target.value],
                  })
                }
              />
            </>
          ) : needsMultiselect ? (
            // Multi-select input for specific rule types
            <SearchMultiSelect
              rule={rule}
              rules={rules}
              addValueToRule={addValueToRule}
              removeValueFromRule={removeValueFromRule}
              getSelectedCount={getSelectedCount}
            />
          ) : rule.type !== RuleTypeEnum.PRODUCT_SUBSCRIBED ? (
            // Default single-value input field
            <Input
              type={
                rule.type === RuleTypeEnum.CART_VALUE_RANGE ||
                rule.type === RuleTypeEnum.COUNT_OF_ITEMS_IN_CART ||
                rule.type === RuleTypeEnum.INDIVIDUAL_PRODUCT_COUNT_IN_CART
                  ? 'number'
                  : 'text'
              }
              className='border rounded px-3 py-2 flex-2'
              placeholder='Enter value'
              value={rule.values[0] || ''}
              onChange={(e) =>
                updateRule(rule.id, { values: [e.target.value] })
              }
            />
          ) : (
            <></>
          )}

          {/* Button to remove the rule */}
          <Button
            onClick={() => removeRule(rule.id)}
            className='p-2 text-gray-500 hover:text-gray-800 bg-transparent hover:bg-transparent border-0 shadow-none'
          >
            <X size={20} />
          </Button>
        </div>

        {/* Display selected multi-select values as chips */}
        {needsMultiselect && rule.values.length > 0 && (
          <div className='flex flex-wrap gap-2 ml-4 mt-2'>
            {rule.values.map((value) => (
              <div
                key={value}
                className='bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1'
              >
                <span>{value}</span>
                <button
                  onClick={() => removeValueFromRule(rule.id, value)}
                  className='text-gray-500 hover:text-red-500'
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
