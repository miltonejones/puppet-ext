
  const transform = step => {
    let label;
    switch (step.action) {
      case 'navigate':
        return [{...step, label: `Navigate to ${step.URL}`}];
        break;
      case 'event':
        label = !step.value
          ? `${step.event} ${step.propName || step.actionKey} `
          : `${step.event} ${step.propName || step.actionKey} to ${step.value}`
        return [
          { 
            "action": "lookup-by-" + step.by,
            "key": step.actionKey 
          },
          {
            label,
            "object": { 
              "key":  step.actionKey, 
              "value": step.value,
            },
            "action": step.event, 
            "value": step.value,
            "photo": true
          }
        ];
        break;
      case 'expect':
        label = !step.fact.value
          ? `TEST: Is "${step.propName || step.actionKey}" in the document `
          : `TEST: Does "${step.propName || step.actionKey}.value" equal ${value} `
        return [
          { 
            "action": "lookup-by-" + step.by,
            "key": step.actionKey, 
          },
          {
            label,
            fact: { 
              "key":  step.actionKey, 
              "value": step.fact.value,
            },
            "action": "exists",
            "value": step.fact.value,
            "photo": true
          }
        ];
        break;
      case 'upload':
          label = `upload ${step.path} using ${step.propName || step.actionKey}`;
          return [
            { 
              "action": "lookup-by-" + step.by,
              "key": step.actionKey, 
            },
            {
              label,
              action: 'upload',
              path: step.path,
              key: step.actionKey, 
            }
          ];
          break;
      default: 
        const { actionKey, key, ...rest} = step;
        return [{...rest, key: key || actionKey}]
    }
  }