import { Mutations } from 'vuex-smart-module';
import { RequisitesState } from './state';

import { CompanyInfo, BankRequisites, Contacts } from '@/types/requisites';

export class RequisitesMutations extends Mutations<RequisitesState> {
  setBankRequisites(bankRequisites: BankRequisites[]) {
    this.state.requisitesData.bank_requisites = bankRequisites;
  }

  setCompanyInfo(companyInfo: CompanyInfo) {
    this.state.requisitesData.company_info = companyInfo;
  }

  setContacts(contacts: Contacts) {
    this.state.requisitesData.contacts = contacts;
  }
}
