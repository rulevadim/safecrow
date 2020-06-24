export type CompanyInfo = {
  chief_user_fio: string;
  chief_user_position: string;
  company_name: string;
  grounds_for_actions: string;
  inn: string;
  kpp: string;
  legal_address: string;
  ogrn: string;
  physical_address: string;
  info_id?: string;
};

export type UserInfo = {
  fio: string;
  info_id?: string;
};

export type BankRequisites = {
  address: string;
  bank_identification_code: string;
  bank_name: string;
  checking_account: string;
  city: string;
  corr_account: string;
  detail_name: string;
  default_detail?: boolean;
  requisite_id?: string;
};

export type BankCardRequisites = {
  field1: string;
  field2: string;
  default_detail?: boolean;
  requisite_id?: string;
};

export type Contacts = {
  contact_user_email: string;
  contact_user_fio: string;
  contact_user_phone: string;
  contact_user_position: string;
  info_id?: string;
};

export type ContactsIndividual = {
  email: string;
  phone: string;
  info_id?: string;
};

export type LegalRequisites = {
  company_info: CompanyInfo;
  bank_requisites: BankRequisites[];
  contacts: Contacts;
};

export type IndividualRequisites = {
  user_info: UserInfo;
  bank_requisites: (BankRequisites | BankCardRequisites)[];
  contacts: ContactsIndividual;
};

export type OrderLegalRequisites = {
  company_inn: string;
  company_kpp: string;
  company_legal_address: string;
  company_name: string;
  company_ogrn: string;
  company_phisical_address: string;
  chief_user_basis_for_action: string;
  chief_user_fio: string;
  chief_user_position: string;
  bank_address: string;
  bank_checking_account: string;
  bank_city: string;
  bank_corr_account: string;
  bank_identification_code: string;
  bank_name: string;
  contact_user_email: string;
  contact_user_fio: string;
  contact_user_phone: string;
  contact_user_position: string;
};
/*

export type BankRequisites = {
    bank_address: string;
    bank_checking_account: string;
    bank_city: string;
    bank_corr_account: string;
    bank_identification_code: string;
    bank_name: string;
    bank_requisites_name?: string;
};

export type ChiefRequisites = {
    chief_user_basis_for_action: string;
    chief_user_fio: string;
    chief_user_position: string;
};

export type CompanyRequisites = {
    company_inn: string;
    company_kpp: string;
    company_legal_address: string;
    company_name: string;
    company_ogrn: string;
    company_phisical_address: string;
    info_id?: string;
};

export type ContactRequisites = {
    contact_user_email: string;
    contact_user_fio: string;
    contact_user_phone: string;
    contact_user_position: string;
    info_id?: string;
};

export type OrderLegalRequisites = BankRequisites & ChiefRequisites & CompanyRequisites & ContactRequisites;

export type LegalRequisites = { bank_requisites: BankRequisites[] } & ChiefRequisites &
    CompanyRequisites &
    ContactRequisites;

export type Requisites = {
    company_info: CompanyRequisites | "";
    bank_requisites: (BankRequisites & ChiefRequisites)[] | "";
    contacts: ContactRequisites | "";
};

*/
