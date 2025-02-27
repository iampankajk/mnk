import React, { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Rule, RULE_PRIORITY, RULE_OPERATORS } from '@/types/rules';
import { Button } from '@/components/ui/button';
import { RuleItem } from './RuleItem';
import RuleSummary from './RuleSummary';

const RuleBuilder: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  const sortRulesByPriority = useCallback(
    (rules: Rule[]): Rule[] =>
      [...rules].sort(
        (a, b) => RULE_PRIORITY.indexOf(a.type) - RULE_PRIORITY.indexOf(b.type)
      ),
    []
  );

  // Check if all rule types are used
  const allRulesUsed = useMemo(() => {
    return RULE_PRIORITY.every((type) =>
      rules.some((rule) => rule.type === type)
    );
  }, [rules]);

  const addRule = () => {
    setRules((currentRules) => {
      const usedTypes = new Set(currentRules.map((rule) => rule.type));

      // Find first unused rule type from top priority
      const newType = RULE_PRIORITY.find((type) => !usedTypes.has(type));

      if (!newType) {
        // All rule types are used
        return currentRules;
      }

      const newRule: Rule = {
        id: Math.random().toString(36).substring(2, 9),
        type: newType,
        operator: RULE_OPERATORS[newType][0],
        values: [],
      };

      return sortRulesByPriority([...currentRules, newRule]);
    });
  };

  const removeRule = useCallback((ruleId: string) => {
    setRules((current) => current.filter((rule) => rule.id !== ruleId));
  }, []);

  const updateRule = useCallback(
    (ruleId: string, updates: Partial<Rule>, resetOperator = false) => {
      setRules((currentRules) => {
        const updatedRules = currentRules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          if (resetOperator && updates.type) {
            updates.operator = RULE_OPERATORS[updates.type][0];
            updates.values = [];
          }
          return { ...rule, ...updates };
        });
        return sortRulesByPriority(updatedRules);
      });
    },
    [sortRulesByPriority]
  );

  const addValueToRule = useCallback((ruleId: string, value: string) => {
    setRules((currentRules) => {
      return currentRules.map((rule) => {
        if (rule.id !== ruleId) return rule;
        if (rule.values.includes(value)) return rule;
        return { ...rule, values: [...rule.values, value] };
      });
    });
  }, []);

  const removeValueFromRule = (ruleId: string, value: string) => {
    setRules((currentRules) => {
      return currentRules.map((rule) => {
        if (rule.id !== ruleId) return rule;
        return { ...rule, values: rule.values.filter((v) => v !== value) };
      });
    });
  };

  const getSelectedCount = (values: string[], totolOption: number): string => {
    if (values.length === 0) return '';
    return `${values.length}/${totolOption}`;
  };

  console.log(rules);

  return (
    <div className='flex max-w-6xl mx-auto gap-4 p-2'>
      <div className='bg-white rounded-lg shadow-lg flex-1 p-6'>
        <div className='space-y-2'>
          <h2 className='text-xl font-medium text-gray-700'>Rule</h2>
          <p className='text-gray-500 '>
            The offer will be triggered based on the rules in this section
          </p>
        </div>

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
      <RuleSummary rules={rules} />
    </div>
  );
};

export default RuleBuilder;
