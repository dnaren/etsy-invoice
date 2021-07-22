// chrome.runtime.sendMessage({type: 'orderData', options:{
//   message: data
// }});

var data = {};
data.receiptNumber = getReceiptNumber();
data.shipTo = getShipTo();
data.orderItems = getOrderItems();
data.orderDate = getOrderDate();

//the last executing expression becomes the return value of the content script
data;

function getReceiptNumber() {
  var receiptText = document.querySelector('#order-details-order-info a');
  if (receiptText) {
    return receiptText.textContent;
  }
}

function getOrderDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
  // var orderDateString = document.querySelector('#payment-msg').textContent;
  // if (orderDateString) {
  //   return orderDateString.substring(orderDateString.indexOf('on') + 3)
  // }
}

function getShipTo() {
  var addressDiv = document.querySelector('div.address');
  if (addressDiv) {
    var shipTo = {};
    shipTo.name = addressDiv.getElementsByClassName('name')[0].innerText;
    shipTo.address = addressDiv.getElementsByClassName('first-line')[0].innerText;
    shipTo.city = addressDiv.getElementsByClassName('city')[0].innerText;
    shipTo.state = addressDiv.getElementsByClassName('state')[0].innerText;
    shipTo.zip = addressDiv.getElementsByClassName('zip')[0].innerText;
    shipTo.country = addressDiv.getElementsByClassName('country-name')[0].innerText;

    return shipTo;
  }
}

function getOrderItems() {
  var tables = document.getElementsByTagName('table');
  if (tables) {
    return tableToJson(tables[0]);
  }
}

function tableToJson(table) {
  var data = [];
  for (var i = 1; i < table.rows.length; i++) {
    var tableRow = table.rows[i];
    var rowData = {};
    rowData.itemNumber = i;
    for (var j = 0; j < tableRow.cells.length; j++) {      
      if (j == 0) {
        rowData.itemName = tableRow.cells[j].querySelector('div a').title;
      } else if (j == 1) {
        rowData.quantity = tableRow.cells[j].querySelector('p').innerHTML;
      } else {
        rowData.price = tableRow.cells[j].querySelector('p').innerHTML;
      }
    }
    data.push(rowData);
  }
  return data;
}