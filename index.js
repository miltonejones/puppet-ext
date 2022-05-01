

const propBag = {};

const executeStep = async (step) => {
  const { action, label, key, object, URL } = step;
  let message, target;
  switch(action) {
    case "navigate":
      window.location.replace (URL);
      message = 'Navigated to ' + URL
      break;
    case "lookup-by-selector":
      Object.assign(propBag, { [key]: $(key) })
      message = 'Found ' + key
      console.log ({ propBag })
      break;
    case "click":
      target = $(propBag[object.key]);
      target.trigger('click');
      message = !target ? `Could not find ${object.key}` : 'Clicked' + object.key
      break;
    case "change":
      target = $(propBag[object.key]);
      target.val(step.value);
      message = !target ? `Could not find ${object.key}` : 'Changed' + object.key + ' to ' + step.value
      break;
    default:
      message = `Unsupported action "${action}"`
      // do nothing
  }
  return message;
}


function start() {
  console.log(`Puppeteer Studio. Ready.`) 
  var jq = document.createElement('script');
  jq.onload = () => {
    console.log ("JQUERY LOADED")
  };
  jq.src = "https://code.jquery.com/jquery-2.1.1.min.js";
  document.querySelector('head').appendChild(jq)
}

start()


const snap = () => new Promise (yes => {

  const screenshotTarget = document.body;

  html2canvas(screenshotTarget).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");
      console.log ({base64image})
      yes(base64image) 
  });
})

async function sendFoo(sendResponse) {
  const img = await snap()
  sendResponse({ img, farewell: 'well??!' })
}

async function sendStep(step, sendResponse) {
  const message = await executeStep(step);
  const img = await snap()
  sendResponse({ img, message })
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action) {
      sendStep(request, sendResponse);
      return true;
    }


    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.greeting === "hello") {
      sendFoo(sendResponse)
      return true 
    }
  }
);

console.log ("I AM HERE!! Are you??")