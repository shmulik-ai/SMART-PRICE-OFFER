export interface MastSection {
  type: string;
  quantity: string;
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
  clientCompany: string;
  clientContact: string;
  clientAddress: string;
  clientCity: string;
  clientCountry: string;
  clientPhone: string;
  clientEmail: string;

  // Section 1 - Crane Technical Specs
  craneModel: string;
  manufacturingYear: string;
  jibLength: string;
  freestandingHeight: string;
  mastSections: MastSection[];
  cabinType: string;
  maxLoadCapacity: string;
  maxHookHeight: string;

  // Section 2 - Electrical & Mechanical
  hoistingSpeed: string;
  slewingSpeed: string;
  trolleySpeed: string;

  // Section 3 - Condition & Extras
  craneCondition: string;
  certifications: string;
  includedComponents: string;
  excludedComponents: string;
  deliveryTerms: string;
  deliveryTime: string;
  warranty: string;

  // Notes (before pricing)
  notes: string;

  // Section 4 - Pricing
  currency: string;
  unitPrice: string;
  quantity: string;
  discountPercent: string;
  taxPercent: string;
  shippingCost: string;
  paymentTerms: string;
}

export const defaultData: QuotationData = {
  quoteNumber: `QT-${new Date().getFullYear()}-001`,
  quoteDate: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  salesRep: '',
  companyName: 'RMA Cranes',
  companyLogo: '',

  clientCompany: '',
  clientContact: '',
  clientAddress: '',
  clientCity: '',
  clientCountry: '',
  clientPhone: '',
  clientEmail: '',

  craneModel: '',
  manufacturingYear: '',
  jibLength: '',
  freestandingHeight: '',
  mastSections: [{ type: '', quantity: '' }],
  cabinType: '',
  maxLoadCapacity: '',
  maxHookHeight: '',

  hoistingSpeed: '',
  slewingSpeed: '',
  trolleySpeed: '',

  craneCondition: '',
  certifications: '',
  includedComponents: '',
  excludedComponents: '',
  deliveryTerms: '',
  deliveryTime: '',
  warranty: '',

  notes: '',

  currency: 'USD',
  unitPrice: '',
  quantity: '1',
  discountPercent: '0',
  taxPercent: '0',
  shippingCost: '0',
  paymentTerms: '',
};
