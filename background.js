chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (message === 'parse-order-data') {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ['parseOrder.js']
    }, (results) => {
      if (results && results[0]) {
        chrome.storage.local.set({ 'orderData': results[0].result }, () => {
          reply({ success: true });
        });
      }
    });
    return true; // required for async reply
  } else if (message === 'get-order-data') {
    chrome.storage.local.get(['orderData'], (result) => {
      reply(result.orderData || {});
    });
    return true; // required for async reply
  }
});
