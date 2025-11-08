import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface InvoiceData {
  _id: string;
  name: string;
  filePath?: string;
  fileSize?: { $numberLong: string };
  fileType?: string;
  status: string;
  organizationId: string;
  departmentId: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  isValidatedByHuman?: boolean;
  uploadedById: string;
  extractedData?: any;
}

async function main() {
  console.log('🚀 Starting data ingestion...');

  // Read JSON file
  const dataPath = path.join(__dirname, '../../../Data/Analytics_Test_Data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const invoices: InvoiceData[] = JSON.parse(rawData);

  console.log(`📊 Found ${invoices.length} invoices to process`);

  let processed = 0;
  let errors = 0;

  for (const invoiceData of invoices) {
    try {
      const llmData = invoiceData.extractedData?.llmData;

      // Extract vendor info
      const vendorData = llmData?.vendor?.value;
      let vendorId: string | undefined;

      if (vendorData?.vendorName?.value) {
        // Check if vendor exists
        const existingVendor = await prisma.vendor.findFirst({
          where: {
            name: vendorData.vendorName.value,
            taxId: vendorData.vendorTaxId?.value || null
          }
        });

        if (existingVendor) {
          vendorId = existingVendor.id;
        } else {
          // Create new vendor
          const vendor = await prisma.vendor.create({
            data: {
              name: vendorData.vendorName.value,
              partyNumber: vendorData.vendorPartyNumber?.value,
              address: vendorData.vendorAddress?.value,
              taxId: vendorData.vendorTaxId?.value,
              email: vendorData.vendorEmail?.value,
              phone: vendorData.vendorPhone?.value,
              iban: vendorData.vendorIban?.value,
              bic: vendorData.vendorBic?.value
            }
          });
          vendorId = vendor.id;
        }
      }

      // Extract customer info
      const customerData = llmData?.customer?.value;
      let customerId: string | undefined;

      if (customerData?.customerName?.value) {
        const existingCustomer = await prisma.customer.findFirst({
          where: { name: customerData.customerName.value }
        });

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const customer = await prisma.customer.create({
            data: {
              name: customerData.customerName.value,
              partyNumber: customerData.customerPartyNumber?.value,
              address: customerData.customerAddress?.value,
              taxId: customerData.customerTaxId?.value
            }
          });
          customerId = customer.id;
        }
      }

      // Parse dates
      const invoiceDate = llmData?.invoice?.value?.invoiceDate?.value 
        ? new Date(llmData.invoice.value.invoiceDate.value) 
        : null;
      
      const deliveryDate = llmData?.invoice?.value?.deliveryDate?.value
        ? new Date(llmData.invoice.value.deliveryDate.value)
        : null;

      const dueDate = llmData?.payment?.value?.dueDate?.value
        ? new Date(llmData.payment.value.dueDate.value)
        : null;

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          id: invoiceData._id,
          name: invoiceData.name,
          filePath: invoiceData.filePath,
          fileSize: invoiceData.fileSize?.$numberLong ? BigInt(invoiceData.fileSize.$numberLong) : null,
          fileType: invoiceData.fileType,
          status: invoiceData.status,
          organizationId: invoiceData.organizationId,
          departmentId: invoiceData.departmentId,
          createdAt: new Date(invoiceData.createdAt.$date),
          updatedAt: new Date(invoiceData.updatedAt.$date),
          isValidatedByHuman: invoiceData.isValidatedByHuman || false,
          uploadedById: invoiceData.uploadedById,
          invoiceNumber: llmData?.invoice?.value?.invoiceId?.value,
          invoiceDate,
          deliveryDate,
          dueDate,
          vendorId,
          customerId
        }
      });

      // Create line items
      const lineItems = llmData?.lineItems?.value?.items?.value || [];
      for (const item of lineItems) {
        await prisma.lineItem.create({
          data: {
            invoiceId: invoice.id,
            description: item.description?.value || 'N/A',
            quantity: item.quantity?.value ? parseFloat(item.quantity.value) : null,
            unitPrice: item.unitPrice?.value ? parseFloat(item.unitPrice.value) : null,
            total: item.total?.value ? parseFloat(item.total.value) : null,
            taxRate: item.taxRate?.value ? parseFloat(item.taxRate.value) : null,
            taxAmount: item.taxAmount?.value ? parseFloat(item.taxAmount.value) : null,
            articleNumber: item.articleNumber?.value,
            unit: item.unit?.value
          }
        });
      }

      // Create payment info
      const paymentData = llmData?.payment?.value;
      if (paymentData) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            dueDate,
            paymentTerms: paymentData.paymentTerms?.value,
            bankName: paymentData.bankName?.value,
            iban: paymentData.iban?.value,
            bic: paymentData.bic?.value,
            accountHolder: paymentData.accountHolder?.value
          }
        });
      }

      // Create summary
      const summaryData = llmData?.summary?.value;
      if (summaryData) {
        await prisma.summary.create({
          data: {
            invoiceId: invoice.id,
            subTotal: summaryData.subTotal?.value ? parseFloat(summaryData.subTotal.value) : 0,
            totalTax: summaryData.totalTax?.value ? parseFloat(summaryData.totalTax.value) : 0,
            invoiceTotal: summaryData.invoiceTotal?.value ? parseFloat(summaryData.invoiceTotal.value) : 0,
            currencySymbol: summaryData.currencySymbol?.value || 'EUR'
          }
        });
      }

      processed++;
      if (processed % 10 === 0) {
        console.log(`✅ Processed ${processed}/${invoices.length} invoices`);
      }
    } catch (error) {
      errors++;
      console.error(`❌ Error processing invoice ${invoiceData._id}:`, error);
    }
  }

  console.log(`\n🎉 Ingestion complete!`);
  console.log(`✅ Successfully processed: ${processed}`);
  console.log(`❌ Errors: ${errors}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
