document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage('get-order-data', (orderData) => {
    var template = document.getElementById('template').innerHTML;
    var rendered = Mustache.render(template, orderData);
    document.getElementById('target').innerHTML = rendered;
  });
});