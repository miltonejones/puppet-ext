
const Library = {};


const setSelectedTest = id => {
  const { Items } = Library;
  const Selected = Items.find(i => i.suiteID === id);
  console.log ({ Selected })
  Object.assign(Library, { Selected });

  collapse(492);
  const stepList = Box({
    children: ListGroup(Selected.steps.map(actionLabel)) ,
    sx: {
      height: '300px',
      overflow: 'auto'
    }
  });

  // $('#execButton').attr('disabled', false);

  const header = $('<div class="flex center"></div>');
  const backBtn = $('<i style="margin-right: 12px" class="fa-solid fa-arrow-left"></i>');
  backBtn.on('click', showSearch);
  header.append(backBtn)
  header.append(`<h4>${Selected.testName}</h4>`);


  show($("#execWrapper"))
  // $("#execButton").show()
  $("#findTests").hide() 
  $("#testItems") 
  .empty()
  .append(header)
  .append($('<hr/>'))
  .append(stepList)
}

const showSearch = () => {
  // $("#execButton").hide()

  hide($("#execWrapper"))
  $("#findTests").show()
  $("#changeColor").hide()
  collapse(220);
  display(`${Library.Items.length} tests loaded`);
}



const getTests = async () => {
  const { Items } = await getTestSuites();
  Object.assign(Library, { Items })
  console.log ({ Items })
  showSearch()
  return Items;
}

$("#findTests").hide()
$("#findTests").on('keyup', () => {
  const { Items } = Library;
  const val = $("#findTests").val();
  const filtered = Items
    .filter(f => f.testName.toLowerCase().indexOf(val.toLowerCase()) > -1)
    .map(f => TestLink(f.suiteID, f.testName));
    collapse(460);
    $("#testItems").html(Box({
      children: ListGroup(filtered),
      sx: {
        height: '300px',
        overflow: 'auto'
      }
    }))
});

const runStep = step => new Promise(yes => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const { id } = tabs[0];
    console.log ({ id });

    chrome.tabs.sendMessage(id, step, function(response) {
      if (!response) {
        return yes ("Could not read response")
      } 
      yes (response.message)
      const html = $(`<img style="margin:24px" width="540" src="${response.img}"/>`)
      display(html);
    });
  });

})

const paws = (time) => new Promise(yes => {
  window.setTimeout(yes, time * 999);
});

const getSteps = () => {
  const { Selected } = Library;
  const transformed = ((out) => {
    Selected.steps.filter(f => !!f.action).map (s => out = out.concat(transform(s)))
    return out;
  })([])

  return transformed;
}

const runTest = async (index = 0) => {
  const steps = getSteps()
  if (!(index <  steps.length)) {
    return console.log ('done');
  }
  const step = steps[index];
  const status = await runStep(step);

  console.log (status, step);

  await paws(5);

  return await runTest(++index); 
}

const collapse = height => {
  $('body').css ({ height: `${height}px` })
}

const display = children => {
  $("#testItems").empty().append(Box({
    children,
    sx: {
      paddingTop: '24px'
    }
  }));
}

const hide = element => {
  element.css ({
    width: 0,
    height: 0,
    overflow: "hidden",
    transition: "width 0.2s linear"
  });
}

const show = (element, size = 80) => {
  element.css ({
    width: size + 'px',
    height: 'inherit'
  })
}


$(document).ready(function() {

  $('#exitButton').on('click', () => {
    window.close()
  })
  hide($("#execWrapper"))
  // $("#execButton").hide()
  collapse(160);
  display ( ProgressBar() );
  getTests( ) 
});