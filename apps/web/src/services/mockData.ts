// Mock invoice data for development when API is not available
export const mockInvoices = [
  {
    "_id": "1",
    "name": "Invoice-001.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-10-15T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Phunk GmbH" } } },
        "summary": { "value": { "invoiceTotal": { "value": 736.78 } } },
        "invoice": { "value": { "invoiceId": { "value": "RE-1001" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Marketing Service" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-10-20" } } }
      }
    }
  },
  {
    "_id": "2",
    "name": "Invoice-002.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-10-15T11:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Phunk GmbH" } } },
        "summary": { "value": { "invoiceTotal": { "value": 736.78 } } },
        "invoice": { "value": { "invoiceId": { "value": "RE-1002" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Operations Service" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-10-25" } } }
      }
    }
  },
  {
    "_id": "3",
    "name": "Invoice-003.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-09-20T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Phunk GmbH" } } },
        "summary": { "value": { "invoiceTotal": { "value": 736.78 } } },
        "invoice": { "value": { "invoiceId": { "value": "RE-1003" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Facility Management" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-11-15" } } }
      }
    }
  },
  {
    "_id": "4",
    "name": "Invoice-004.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-08-10T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Test Solutions" } } },
        "summary": { "value": { "invoiceTotal": { "value": 450.50 } } },
        "invoice": { "value": { "invoiceId": { "value": "INV-2001" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Marketing Campaign" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-11-20" } } }
      }
    }
  },
  {
    "_id": "5",
    "name": "Invoice-005.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-07-15T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Innoventures" } } },
        "summary": { "value": { "invoiceTotal": { "value": 1250.00 } } },
        "invoice": { "value": { "invoiceId": { "value": "INV-3001" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Operations Support" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-12-01" } } }
      }
    }
  },
  {
    "_id": "6",
    "name": "Invoice-006.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-06-20T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "DataScribe" } } },
        "summary": { "value": { "invoiceTotal": { "value": 890.25 } } },
        "invoice": { "value": { "invoiceId": { "value": "DS-5001" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Facility Heating Service" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-12-10" } } }
      }
    }
  },
  {
    "_id": "7",
    "name": "Invoice-007.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-05-10T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "OmegaTech" } } },
        "summary": { "value": { "invoiceTotal": { "value": 2100.00 } } },
        "invoice": { "value": { "invoiceId": { "value": "OT-7001" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Operations Infrastructure" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-12-15" } } }
      }
    }
  },
  {
    "_id": "8",
    "name": "Invoice-008.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-04-15T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Dinogeo AG" } } },
        "summary": { "value": { "invoiceTotal": { "value": 678.90 } } },
        "invoice": { "value": { "invoiceId": { "value": "DG-9001" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Marketing Analytics" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-11-25" } } }
      }
    }
  },
  {
    "_id": "9",
    "name": "Invoice-009.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-03-20T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Global Supply" } } },
        "summary": { "value": { "invoiceTotal": { "value": 8679.25 } } },
        "invoice": { "value": { "invoiceId": { "value": "GS-1234" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Operations Equipment" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-11-30" } } }
      }
    }
  },
  {
    "_id": "10",
    "name": "Invoice-010.pdf",
    "status": "processed",
    "createdAt": { "$date": "2025-02-10T10:00:00.000Z" },
    "extractedData": {
      "llmData": {
        "vendor": { "value": { "vendorName": { "value": "Phunk GmbH" } } },
        "summary": { "value": { "invoiceTotal": { "value": 1456.80 } } },
        "invoice": { "value": { "invoiceId": { "value": "RE-1010" } } },
        "lineItems": { "value": { "items": { "value": [{ "description": { "value": "Facility Maintenance" } }] } } },
        "payment": { "value": { "dueDate": { "value": "2025-11-10" } } }
      }
    }
  }
];
