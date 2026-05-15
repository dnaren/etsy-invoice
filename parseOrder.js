var data = {};
data.receiptNumber = getReceiptNumber();
data.shipTo = getShipTo();
data.orderItems = getOrderItems();
data.orderDate = getOrderDate();

//the last executing expression becomes the return value of the content script
data;

function getEtsyOrder() {
  try {
    var ctx = window.Etsy && window.Etsy.Context &&
              window.Etsy.Context.data &&
              window.Etsy.Context.data.initial_data;
    if (ctx && ctx.orders && ctx.orders.orders_search && ctx.orders.orders_search.orders) {
      return ctx.orders.orders_search.orders[0];
    }
  } catch(e) {}
  return null;
}

function getReceiptNumber() {
  var order = getEtsyOrder();
  if (order && order.order_id) {
    return '#' + order.order_id;
  }
  // fallback: DOM
  var receiptText = document.querySelector("#order-details-order-info > a:nth-child(1)");
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
}

function getShipTo() {
  var order = getEtsyOrder();
  if (order && order.fulfillment && order.fulfillment.to_address) {
    var addr = order.fulfillment.to_address;
    var shipTo = {};
    shipTo.name = addr.name || '';
    shipTo.address = addr.first_line || '';
    if (addr.second_line) {
      shipTo.addressSecondLine = addr.second_line;
    }
    shipTo.city = addr.city || '';
    if (addr.state) {
      shipTo.state = addr.state;
    }
    shipTo.zip = addr.zip || '';
    shipTo.country = addr.country || '';
    return shipTo;
  }

  // fallback: DOM — target the visible address div (break-word distinguishes it from hidden accordion)
  var addressDivs = document.querySelectorAll('div.address.break-word');
  for (var i = 0; i < addressDivs.length; i++) {
    var div = addressDivs[i];
    var nameEl = div.getElementsByClassName('name')[0];
    if (nameEl && nameEl.textContent.trim()) {
      var shipTo = {};
      shipTo.name = nameEl.textContent.trim();
      var firstLine = div.getElementsByClassName('first-line')[0];
      shipTo.address = firstLine ? firstLine.textContent.trim() : '';
      var secondLine = div.getElementsByClassName('second-line')[0];
      if (secondLine && secondLine.textContent.trim()) {
        shipTo.addressSecondLine = secondLine.textContent.trim();
      }
      var cityEl = div.getElementsByClassName('city')[0];
      shipTo.city = cityEl ? cityEl.textContent.trim() : '';
      var stateEl = div.getElementsByClassName('state')[0];
      if (stateEl) {
        shipTo.state = stateEl.textContent.trim();
      }
      var zipEl = div.getElementsByClassName('zip')[0];
      shipTo.zip = zipEl ? zipEl.textContent.trim() : '';
      var countryEl = div.getElementsByClassName('country-name')[0];
      shipTo.country = countryEl ? countryEl.textContent.trim() : '';
      return shipTo;
    }
  }
}

function getOrderItems() {
  var order = getEtsyOrder();
  if (order && order.transactions && order.transactions.length) {
    return order.transactions.map(function(txn, idx) {
      var rowData = {};
      rowData.itemNumber = idx + 1;
      rowData.itemName = (txn.product && txn.product.title) ? txn.product.title : '';
      rowData.quantity = String(txn.quantity || '');
      rowData.price = (txn.cost && txn.cost.formatted_value) ? txn.cost.formatted_value : '';
      return rowData;
    });
  }

  // fallback: original table-based approach
  var tables = document.getElementsByTagName('table');
  if (tables && tables.length) {
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
