var orderData;

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (message === 'parse-order-data') {
    chrome.tabs.executeScript(null, { file: 'parseOrder.js' }, function (data) {
      orderData = data[0];
    });
  } else if (message === 'get-order-data') {
    reply(orderData);
  }
});