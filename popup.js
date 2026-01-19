document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage('parse-order-data', (response) => {
    console.log('Parse Order Data Response:', response);
    if (response && !response.success) {
      console.error('Failed to parse order data');
    }
  });

  document.getElementById('invoice').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('invoice.html') });
  });
  document.getElementById('customsForm').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('customsForm.html') });
  });
});