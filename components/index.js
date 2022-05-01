
const actionLabel = step => {
    let { label, action } = step;
    switch (action) {
      case 'navigate': 
        label = `Navigate to ${step.URL}`
        break;
      case 'event':
        label = `${step.event} ${step.by} ${step.actionKey}`
        break
      default:
        // do nothing
    }
    return label || action;
  }
  
  const RunButton = () => {
    const html = $("<button class='btn btn-sm btn-primary'>Run Test</button>");
    html.on('click', () => runTest())
    return html;
  }

  const ListItem = item => {
    const html = $(`<li class="list-group-item"></li>`);
    html.append(item);
    return html;
  }
  
  const TestLink = (id, text) => {
    const html = $(`<u style="cursor: pointer">${text}</u>`);
    html.on('click', () => {
      setSelectedTest (id)
    })
    return html;
  }
  
  
  const ListGroup = list => {
    const html = $('<ul class="list-group"></ul>');
    list.map(item => html.append(ListItem(item)));
    return html;
  } 
  
  const ProgressBar = (value = 100) => {
      const html = $(`<div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
            aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${value}%"></div>
     </div>`)
     return html;
  }

  const Flex = (options) => {
    return Box({
      ...options,
      sx: {
        ...options.sx,
        display: 'flex'
      }
    })
  }

  const Box = ({ children, sx }) => {
    const html = $("<div></div>");
    html.css ({...sx});
    html.append(children);
    return html;
  }