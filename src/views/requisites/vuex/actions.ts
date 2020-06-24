import { Actions } from 'vuex-smart-module';
import { RequisitesState } from './state';
import { RequisitesGetters } from './getters';
import { RequisitesMutations } from './mutations';

import store from '@/store';
import { PageModule } from '@/states/page';
import { AuthModule } from '@/states/auth';

import { V1RequisitesService } from '@/services/requisites';
import { CompanyInfo, Contacts, BankRequisites, ContactsIndividual } from '@/types/requisites';
import { User } from '@/types/user';

export class RequisitesActions extends Actions<
  RequisitesState,
  RequisitesGetters,
  RequisitesMutations,
  RequisitesActions
> {
  init(): any {
    return Promise.all([
      this.dispatch('fetchBankRequisites'),
      this.dispatch('fetchCompanyInfo'),
      this.dispatch('fetchContacts'),
    ]).catch(err => {
      const statusCode = err?.response?.status ?? 500;
      if (statusCode !== 401 && statusCode !== 405) {
        PageModule.context(store).actions.setError({ statusCode });
        throw err;
      }
    });
  }

  fetchBankRequisites() {
    return V1RequisitesService.fetchBankRequisites().then(resp => {
      let bankRequisites: BankRequisites[] = resp.data;
      if (bankRequisites) {
        const defaultRequisite = bankRequisites.find(requisite => requisite.default_detail);
        bankRequisites = bankRequisites.filter(requisite => !requisite.default_detail);
        bankRequisites.unshift(defaultRequisite);
      }
      this.mutations.setBankRequisites(bankRequisites);
      return resp;
    });
  }

  fetchCompanyInfo(id?: User['id']) {
    const userId = id || AuthModule.context(store).getters.userId();
    return V1RequisitesService.fetchCompanyInfo(userId).then(({ data }) => {
      if (!id) this.mutations.setCompanyInfo(data);
      return data;
    });
  }

  fetchContacts(id?: User['id']) {
    const userId = id || AuthModule.context(store).getters.userId();
    return V1RequisitesService.fetchContacts(userId).then(({ data }) => {
      if (data)
        data.contact_user_phone = data.contact_user_phone.replace(
          /(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/g,
          '$1 ($2) $3 $4 $5'
        );
      if (!id) this.mutations.setContacts(data);
      return data;
    });
  }

  createCompanyInfo(payload: CompanyInfo) {
    return V1RequisitesService.createCompanyInfo(payload).then(({ data }) => {
      return data.info_id;
    });
  }

  updateCompanyInfo(payload: { id: CompanyInfo['info_id']; companyInfo: CompanyInfo }) {
    return V1RequisitesService.updateCompanyInfo(payload.id, payload.companyInfo);
  }

  createContacts(payload: Contacts) {
    payload.contact_user_phone = payload.contact_user_phone.replace(/[^+0-9]/g, '');
    return V1RequisitesService.createContacts(payload).then(({ data }) => {
      return data.info_id;
    });
  }

  updateContacts(payload: { id: Contacts['info_id']; contacts: Contacts }) {
    payload.contacts.contact_user_phone = payload.contacts.contact_user_phone.replace(/[^+0-9]/g, '');
    return V1RequisitesService.updateContacts(payload.id, payload.contacts);
  }

  createContactsIndividual(payload: ContactsIndividual) {
    payload.phone = payload.phone.replace(/[^+0-9]/g, '');
    return V1RequisitesService.createContactsIndividual(payload).then(({ data }) => {
      return data.info_id;
    });
  }

  updateContactsIndividual(payload: { id: ContactsIndividual['info_id']; contacts: ContactsIndividual }) {
    payload.contacts.phone = payload.contacts.phone.replace(/[^+0-9]/g, '');
    return V1RequisitesService.updateContactsIndividual(payload.id, payload.contacts);
  }

  createBankRequisites(payload: BankRequisites) {
    return V1RequisitesService.createBankRequisites(payload).then(({ data }) => {
      return data;
    });
  }

  updateDefaultBankRequisites(payload: BankRequisites['requisite_id']) {
    return V1RequisitesService.updateDefaultBankRequisites(payload);
  }
}
