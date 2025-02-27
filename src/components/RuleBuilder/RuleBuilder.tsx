import React, { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import {
  Rule,
  RULE_PRIORITY,
  RULE_OPERATORS,
  MUTUALLY_EXCLUSIVE_RULES,
  RuleTypeEnum,
} from '@/types/rules';
import { Button } from '@/components/ui/button';
import { RuleItem } from './RuleItem';
import RuleSummary from './RuleSummary';

const RuleBuilder: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  // Function to sort rules based on their priority
  const sortRulesByPriority = useCallback(
    (rules: Rule[]): Rule[] =>
      [...rules].sort(
        (a, b) => RULE_PRIORITY.indexOf(a.type) - RULE_PRIORITY.indexOf(b.type)
      ),
    []
  );

  // Check if all rule types are already used
  const allRulesUsed = useMemo(() => {
    return RULE_PRIORITY.every((type) =>
      rules.some((rule) => rule.type === type)
    );
  }, [rules]);

  // Function to add a new rule
  const addRule = () => {
    setRules((currentRules) => {
      const usedTypes = new Set(currentRules.map((rule) => rule.type));
      const newType = RULE_PRIORITY.find((type) => !usedTypes.has(type));
      if (!newType) return currentRules;

      let newRule: Rule = {
        id: Math.random().toString(36).substring(2, 9),
        type: newType,
        operator: RULE_OPERATORS[newType][0],
        values: [],
      };

      // Handle mutual exclusivity when adding a new rule
      if (MUTUALLY_EXCLUSIVE_RULES.has(newType)) {
        const otherRuleType =
          newType === RuleTypeEnum.SPECIFIC_COLLECTIONS
            ? RuleTypeEnum.SPECIFIC_PRODUCTS
            : RuleTypeEnum.SPECIFIC_COLLECTIONS;
        const otherRule = currentRules.find((r) => r.type === otherRuleType);

        if (otherRule) {
          newRule.operator =
            otherRule.operator === 'contains_any' ? 'is_not' : 'contains_any';
        }
      }

      return sortRulesByPriority([...currentRules, newRule]);
    });
  };

  // Function to remove a rule by its ID
  const removeRule = useCallback((ruleId: string) => {
    setRules((current) => current.filter((rule) => rule.id !== ruleId));
  }, []);

  // Function to update an existing rule
  const updateRule = useCallback(
    (ruleId: string, updates: Partial<Rule>, resetOperator = false) => {
      setRules((currentRules) => {
        let updatedRules = currentRules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          const newRule = { ...rule, ...updates };
          if (resetOperator && updates.type) {
            newRule.operator = RULE_OPERATORS[updates.type][0];
            newRule.values = [];
          }
          return newRule;
        });

        // Handle mutual exclusivity between specific_collections and specific_products
        const updatedRule = updatedRules.find((r) => r.id === ruleId);
        if (updatedRule && MUTUALLY_EXCLUSIVE_RULES.has(updatedRule.type)) {
          const otherRuleType =
            updatedRule.type === RuleTypeEnum.SPECIFIC_COLLECTIONS
              ? RuleTypeEnum.SPECIFIC_PRODUCTS
              : RuleTypeEnum.SPECIFIC_COLLECTIONS;
          const otherRule = updatedRules.find((r) => r.type === otherRuleType);

          if (otherRule) {
            const oppositeOperator =
              updatedRule.operator === 'contains_any'
                ? 'is_not'
                : 'contains_any';
            updatedRules = updatedRules.map((r) => {
              if (r.type === otherRuleType) {
                return { ...r, operator: oppositeOperator };
              }
              return r;
            });
          }
        }

        return sortRulesByPriority(updatedRules);
      });
    },
    [sortRulesByPriority]
  );

  // Function to add a value to a rule
  const addValueToRule = useCallback((ruleId: string, value: string) => {
    setRules((currentRules) => {
      return currentRules.map((rule) => {
        if (rule.id !== ruleId) return rule;
        if (rule.values.includes(value)) return rule; // Prevent duplicate values
        return { ...rule, values: [...rule.values, value] };
      });
    });
  }, []);

  // Function to remove a value from a rule
  const removeValueFromRule = (ruleId: string, value: string) => {
    setRules((currentRules) => {
      return currentRules.map((rule) => {
        if (rule.id !== ruleId) return rule;
        return { ...rule, values: rule.values.filter((v) => v !== value) };
      });
    });
  };

  // Function to get the selected count of values for a rule
  const getSelectedCount = (values: string[], totalOptions: number): string => {
    if (values.length === 0) return '';
    return `${values.length}/${totalOptions}`;
  };

  return (
    <div className='flex h-full max-w-6xl mx-auto gap-4 p-2'>
      <div className='bg-white rounded-lg shadow-lg flex-1 p-6 overflow-auto'>
        {/* Header Section */}
        <div className='space-y-2'>
          <h2 className='text-xl font-medium text-gray-700'>Rule</h2>
          <p className='text-gray-500 '>
            The offer will be triggered based on the rules in this section
          </p>
        </div>

        {/* Rule List Section */}
        <div className='mb-4 border rounded-lg p-6 flex flex-col gap-2'>
          {rules.map((rule, index) => (
            <RuleItem
              key={rule.id}
              rule={rule}
              index={index}
              rules={rules}
              updateRule={updateRule}
              removeRule={removeRule}
              addValueToRule={addValueToRule}
              removeValueFromRule={removeValueFromRule}
              getSelectedCount={getSelectedCount}
            />
          ))}

          {/* Add Rule Button */}
          <div className='flex items-center justify-center mt-4'>
            <Button
              variant={'default'}
              onClick={addRule}
              disabled={allRulesUsed}
              className={`flex items-center gap-2 ${
                allRulesUsed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Plus size={20} />
              <span>AND</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <RuleSummary rules={rules} />
    </div>
  );
};

export default RuleBuilder;
