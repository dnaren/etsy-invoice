document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage('parse-order-data');

  document.getElementById('invoice').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('invoice.html') });
  });
  document.getElementById('customsForm').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('customsForm.html') });
  });
});