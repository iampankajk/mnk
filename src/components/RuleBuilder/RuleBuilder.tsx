import React, { useState, useMemo } from 'react';
import { PlusCircle, X } from 'lucide-react';
import {
  Rule,
  RuleType,
  RULE_PRIORITY,
  RULE_OPERATORS,
  MUTUALLY_EXCLUSIVE_RULES,
  RULE_CATEGORIES,
  RuleTypeEnum,
} from '@/types/rules';
import { OperatorSelect, RuleSelect } from '../ui/select';
import SearchMultiSelect from '../ui/search';

const RuleBuilder: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  // Get all used rules
  const usedRules = useMemo(() => {
    return new Set(rules.map((rule) => rule.type));
  }, [rules]);

  const sortRulesByPriority = (rules: Rule[]): Rule[] => {
    return [...rules].sort(
      (a, b) => RULE_PRIORITY.indexOf(a.type) - RULE_PRIORITY.indexOf(b.type)
    );
  };

  const addRule = (type: RuleType) => {
    const newRule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      operator: RULE_OPERATORS[type][0],
      values: [],
    };

    // Add the new rule and sort based on priority
    setRules((currentRules) => {
      const updatedRules = [...currentRules, newRule];
      return sortRulesByPriority(updatedRules);
    });
  };

  const removeRule = (ruleId: string) => {
    setRules((currentRules) =>
      currentRules.filter((rule) => rule.id !== ruleId)
    );
  };

  const updateRule = (
    ruleId: string,
    updates: Partial<Rule>,
    resetOperator = false
  ) => {
    setRules((currentRules) => {
      const updatedRules = currentRules.map((rule) => {
        if (rule.id !== ruleId) return rule;
        if (resetOperator && updates.type) {
          updates.operator = RULE_OPERATORS[updates.type][0];
        }
        return { ...rule, ...updates };
      });
      return sortRulesByPriority(updatedRules);
    });
  };

  const isOperatorDisabled = (type: RuleType, operator: string): boolean => {
    if (!MUTUALLY_EXCLUSIVE_RULES.has(type)) return false;

    const relatedRule = rules.find(
      (r) => MUTUALLY_EXCLUSIVE_RULES.has(r.type) && r.type !== type
    );

    if (!relatedRule) return false;

    const isInclusion = operator === 'contains_any';
    const hasInclusion = relatedRule.operator === 'contains_any';

    return isInclusion === hasInclusion;
  };

  const isRuleDisabled = (type: RuleType): boolean => {
    return usedRules.has(type);
  };

  const addValueToRule = (ruleId: string, value: string) => {
    setRules((currentRules) => {
      return currentRules.map((rule) => {
        if (rule.id !== ruleId) return rule;
        if (rule.values.includes(value)) return rule;
        return { ...rule, values: [...rule.values, value] };
      });
    });
  };

  const removeValueFromRule = (ruleId: string, value: string) => {
    setRules((currentRules) => {
      return currentRules.map((rule) => {
        if (rule.id !== ruleId) return rule;
        return { ...rule, values: rule.values.filter((v) => v !== value) };
      });
    });
  };

  const needsMultiselect = (type: RuleType): boolean => {
    return [
      'specific_collections',
      'product_tags',
      'product_vendors',
      'specific_products',
    ].includes(type);
  };

  const getSelectedCount = (values: string[]): string => {
    if (values.length === 0) return '';
    return `${values.length}/5`;
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <h2 className='text-2xl font-bold mb-6'>Eligibility Rules</h2>

        <div className='mb-8 border rounded-lg p-4'>
          {rules.map((rule, index) => (
            <div key={rule.id} className='mb-4'>
              {index > 0 && (
                <div className='flex items-center my-2'>
                  <span className='text-sm font-medium text-gray-500'>AND</span>
                </div>
              )}

              <div className='flex items-center gap-4 mb-2'>
                <div className='relative'>
                  <RuleSelect
                    rule={rule}
                    updateRule={updateRule}
                    RULE_CATEGORIES={RULE_CATEGORIES}
                    isRuleDisabled={isRuleDisabled}
                  />
                </div>

                <OperatorSelect
                  rule={rule}
                  updateRule={updateRule}
                  RULE_OPERATORS={RULE_OPERATORS}
                  isOperatorDisabled={isOperatorDisabled}
                />

                {(rule.type === RuleTypeEnum.CART_VALUE_RANGE ||
                  rule.type === RuleTypeEnum.COUNT_OF_ITEMS_IN_CART ||
                  rule.type ===
                    RuleTypeEnum.INDIVIDUAL_PRODUCT_COUNT_IN_CART) &&
                rule.operator === 'between' ? (
                  <>
                    <input
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
                    <input
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
                ) : needsMultiselect(rule.type) ? (
                  <SearchMultiSelect
                    rule={rule}
                    rules={rules}
                    addValueToRule={addValueToRule}
                    removeValueFromRule={removeValueFromRule}
                    getSelectedCount={getSelectedCount}
                  />
                ) : (
                  <input
                    type={
                      rule.type === RuleTypeEnum.CART_VALUE_RANGE ||
                      rule.type === RuleTypeEnum.COUNT_OF_ITEMS_IN_CART ||
                      rule.type ===
                        RuleTypeEnum.INDIVIDUAL_PRODUCT_COUNT_IN_CART
                        ? 'number'
                        : 'text'
                    }
                    className='border rounded px-3 py-2 flex-1'
                    placeholder='Enter value'
                    value={rule.values[0] || ''}
                    onChange={(e) =>
                      updateRule(rule.id, { values: [e.target.value] })
                    }
                  />
                )}

                <button
                  onClick={() => removeRule(rule.id)}
                  className='p-2 text-gray-500 hover:text-red-500'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Selected values display */}
              {needsMultiselect(rule.type) && rule.values.length > 0 && (
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
          ))}

          <div className='mt-4'>
            <button
              onClick={() =>
                addRule(RULE_PRIORITY[rules.length] || 'specific_collections')
              }
              className='flex items-center gap-2 text-blue-600 hover:text-blue-800'
            >
              <PlusCircle size={20} />
              <span>Add Rule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;
