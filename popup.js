document.addEventListener('DOMContentLoaded', () => {
  function requestParse() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab) return console.error('No active tab to parse');
      chrome.runtime.sendMessage({ action: 'parse-order-data', tabId: tab.id }, (response) => {
        console.log('Parse Order Data Response:', response);
        if (!response || !response.success) {
          console.error('Failed to parse order data');
        }
      });
    });
  }

  requestParse();

  document.getElementById('invoice').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('invoice.html') });
  });
  document.getElementById('customsForm').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('customsForm.html') });
  });
});
