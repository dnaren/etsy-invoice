chrome.runtime.onMessage.addListener((message, sender, reply) => {
  // Support both string messages and structured messages
  if (message && message.action === 'parse-order-data') {
    const tabId = message.tabId || (sender && sender.tab && sender.tab.id);
    if (!tabId) {
      reply({ success: false, error: 'no-tab-id' });
      return;
    }
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['parseOrder.js']
    }, (results) => {
      if (chrome.runtime.lastError) {
        reply({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      if (results && results[0]) {
        chrome.storage.local.set({ 'orderData': results[0].result || {} }, () => {
          reply({ success: true });
        });
      } else {
        reply({ success: false, error: 'no-results' });
      }
    });
    return true; // required for async reply
  } else if (message === 'get-order-data' || (message && message.action === 'get-order-data')) {
    chrome.storage.local.get(['orderData'], (result) => {
      reply(result.orderData || {});
    });
    return true; // required for async reply
  }
});
