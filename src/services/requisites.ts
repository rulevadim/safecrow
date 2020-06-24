import HTTP from '@/services/http-common';
import { AxiosPromise } from 'axios';
import { CompanyInfo, BankRequisites, Contacts, ContactsIndividual } from '@/types/requisites';
import { OrderLegalRequisites } from '@/types/requisites';
import { Order } from '@/types/order';
import { User } from '@/types/user';
export class V1RequisitesService {
  public static URLs: Readonly<Record<string, (...args: any[]) => string>> = {
    requisite: (id: Order['order_id']) => `/api/v1/orders/${id}/requisite`,
    bank_requisites: () => '/api/v1/requisites/bank_details',
    company_info: (id: string) => (id ? `/api/v1/requisites/business/${id}` : '/api/v1/requisites/business'),
    contacts: (id: string) =>
      id ? `/api/v1/requisites/business_contacts/${id}` : '/api/v1/requisites/business_contacts',
    contactsIndividual: (id: string) =>
      id ? `/api/v1/requisites/customer_contacts/${id}` : '/api/v1/requisites/customer_contacts',
    payments_method: (id: string) => `/api/v1/requisites/payments_method/${id}`,
  };
  public static fetchBankRequisites(): AxiosPromise<BankRequisites[]> {
    return HTTP.get(this.URLs.bank_requisites());
  }

  public static fetchCompanyInfo(userId: User['id']): AxiosPromise<CompanyInfo> {
    return HTTP.get(this.URLs.company_info(userId));
  }

  public static fetchContacts(userId: User['id']): AxiosPromise<Contacts> {
    return HTTP.get(this.URLs.contacts(userId));
  }

  public static createContacts(data: Contacts): AxiosPromise<{ info_id: string }> {
    return HTTP.post(this.URLs.contacts(), data);
  }

  public static updateContacts(id: Contacts['info_id'], data: Contacts): AxiosPromise<null> {
    return HTTP.put(this.URLs.contacts(id), data);
  }

  public static createContactsIndividual(data: ContactsIndividual): AxiosPromise<{ info_id: string }> {
    return HTTP.post(this.URLs.contactsIndividual(), data);
  }

  public static updateContactsIndividual(
    id: ContactsIndividual['info_id'],
    data: ContactsIndividual
  ): AxiosPromise<null> {
    return HTTP.put(this.URLs.contactsIndividual(id), data);
  }

  public static createCompanyInfo(data: CompanyInfo): AxiosPromise<{ info_id: string }> {
    return HTTP.post(this.URLs.company_info(), data);
  }

  public static updateCompanyInfo(id: CompanyInfo['info_id'], data: CompanyInfo): AxiosPromise<null> {
    return HTTP.put(this.URLs.company_info(id), data);
  }

  public static createBankRequisites(
    data: BankRequisites
  ): AxiosPromise<Pick<BankRequisites, 'default_detail' | 'requisite_id'>> {
    return HTTP.post(this.URLs.bank_requisites(), data);
  }

  public static updateDefaultBankRequisites(id: BankRequisites['requisite_id']): AxiosPromise<null> {
    return HTTP.put(this.URLs.payments_method(id));
  }

  public static createRequisite(id: Order['order_id'], data: OrderLegalRequisites): AxiosPromise<null> {
    return HTTP.post(this.URLs.requisite(id), data);
  }

  public static updateRequisite(id: Order['order_id'], data: OrderLegalRequisites): AxiosPromise<OrderLegalRequisites> {
    return HTTP.put(this.URLs.requisite(id), data);
  }
}
