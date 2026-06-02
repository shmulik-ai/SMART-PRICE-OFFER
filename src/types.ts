export interface MastSection {
  type: string;
  quantity: string;
}

export interface OtherExpense {
  description: string;
  amount: string;
}

export interface QuotationData {
  // Meta
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;
  salesRep: string;
  companyName: string;
  companyLogo: string;

  // Client
  preparedFor: string;
  clientCompany: string;
  clientContact: string;
  clientAddress: string;
  clientCity: string;
  clientCountry: string;
  clientPhone: string;
  clientEmail: string;

  // Section 1 - Crane Technical Specs
  manufacturer: string;
  serialNumber: string;
  craneModel: string;
  manufacturingYear: string;
  jibLength: string;
  freestandingHeight: string;
  mastSections: MastSection[];
  cabinType: string;
  maxLoadCapacity: string;
  tipLoadCapacity: string;

  // Section 2 - Winch Types
  hoistWinch: string;
  trolleyWinch: string;
  trolleyType: string;

  // Section 3 - Condition & Extras
  craneCondition: string;
  certifications: string;
  includedComponents: string;
  excludedComponents: string;
  deliveryTerms: string;
  deliveryTime: string;
  warranty: string;

  // Notes
  notes: string;

  // Section 4 - Pricing
  currency: string;
  unitPrice: string;
  quantity: string;
  discountPercent: string;
  taxPercent: string;
  shippingCost: string;
  paymentTerms: string;

  // Section 5 - Other Expenses (dynamic, each adds to total)
  otherExpenses: OtherExpense[];
}

export const defaultData: QuotationData = {
  quoteNumber: `QT-${new Date().getFullYear()}-002`,
  quoteDate: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  salesRep: '',
  companyName: 'RMA Cranes',
  companyLogo: '',

  preparedFor: '',
  clientCompany: '',
  clientContact: '',
  clientAddress: '',
  clientCity: '',
  clientCountry: '',
  clientPhone: '',
  clientEmail: '',

  manufacturer: 'POTAIN',
  serialNumber: '',
  craneModel: 'MDT219',
  manufacturingYear: '2018',
  jibLength: '',
  freestandingHeight: '50',
  mastSections: [],
  cabinType: '',
  maxLoadCapacity: '',
  tipLoadCapacity: '',

  hoistWinch: '',
  trolleyWinch: '',
  trolleyType: 'SM/DM',

  craneCondition: '',
  certifications: '',
  includedComponents: '',
  excludedComponents: '',
  deliveryTerms: '',
  deliveryTime: '',
  warranty: '',

  notes: '',

  currency: 'EUR',
  unitPrice: '211000',
  quantity: '1',
  discountPercent: '0',
  taxPercent: '18',
  shippingCost: '25000',
  paymentTerms: '',

  otherExpenses: [],
};
