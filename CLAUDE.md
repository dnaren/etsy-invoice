# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Chrome Extension (Manifest v3) for an Etsy seller ("The Little India") that extracts order data from Etsy order pages and generates:
- **Tax Invoices** — with seller GSTIN, IEC, and Indian address
- **Customs Forms (PBE-I)** — Postal Bill of Export for international shipping

## Loading the Extension

No build step. Load directly into Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select this directory

After any code change, click the refresh icon on the extension card in `chrome://extensions/`.

## Linting

JSHint is configured via `.jshintrc` (ES6 target). Run manually if JSHint is installed: `jshint *.js`

## Architecture

### Message-Passing Flow

```
popup.js
  → sends 'parse-order-data' to background.js
  → background.js injects parseOrder.js into the active Etsy tab
  → parseOrder.js reads the Etsy DOM and returns the order object
  → background.js stores it in chrome.storage.local under 'orderData'

User clicks Invoice/Customs Form button
  → popup.js opens invoice.html or customsForm.html in a new tab
  → getOrderData.js (embedded in the template page) sends 'get-order-data' to background.js
  → background.js returns stored 'orderData'
  → getOrderData.js calls Mustache.render() with the template body and data
```

### Key Files

| File | Role |
|------|------|
| `background.js` | Service worker — message broker and storage manager |
| `parseOrder.js` | Content script — DOM scraper for Etsy order pages |
| `popup.js` / `popup.html` | Extension popup UI |
| `invoice.html` / `customsForm.html` | Print templates using Mustache syntax |
| `getOrderData.js` | Retrieves stored data and renders Mustache templates |
| `mustache.min.js` | Bundled template engine (no npm) |

### Data Shape Extracted by `parseOrder.js`

```js
{
  receiptNumber: "Order #12345",
  orderDate: "14/03/2026",        // DD/MM/YYYY, always today's date
  shipTo: {
    name: "John Doe",
    address: "123 Main St",
    addressSecondLine: "Apt 4B",  // optional — conditionally shown in templates
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States"
  },
  orderItems: [
    { itemNumber: 1, itemName: "...", quantity: "2", price: "$25.00" }
  ]
}
```

### DOM Selectors (Etsy-specific, fragile)

`parseOrder.js` uses hardcoded selectors like `#order-details-order-info > a:nth-child(1)` and `.address`. These will break if Etsy changes their page structure.

### Templates

`invoice.html` and `customsForm.html` use Mustache syntax (`{{ field }}`, `{{#section}}...{{/section}}`). Fields highlighted yellow are editable inputs for manual correction before printing. Print CSS hides the yellow styling.

## Business Context

The extension is hardcoded for a single seller: "The Little India" (Indian jewelry exporter). Seller address, GSTIN, and IEC code are embedded directly in the HTML templates and are not data-driven.
