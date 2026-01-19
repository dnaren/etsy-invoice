document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage('get-order-data', (orderData) => {
    console.log('Order Data:', orderData);
    if (orderData && Object.keys(orderData).length > 0) {
      var template = document.getElementById('template').innerHTML;
      var rendered = Mustache.render(template, orderData);
      document.getElementById('target').innerHTML = rendered;
    } else {
      document.getElementById('target').innerHTML = '<p>From getOrderData.js: No order data available. Please visit an Etsy order page first.</p>';
    }
  });
});