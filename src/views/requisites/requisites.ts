// IMPORTS
import { Component, Vue, Watch } from 'vue-property-decorator';
import { RequisitesModule } from './vuex';

// Types
import {
  CompanyInfo,
  BankRequisites,
  Contacts,
  LegalRequisites,
  IndividualRequisites,
  ContactsIndividual,
  UserInfo,
} from '@/types/requisites';

// Helpers
import debounce from 'lodash.debounce';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import validRules from '@/services/valid-rules';

// DaDaTa
import { DadataPartyItem, DadataBankItem, DadataSuggestionsResponseData } from '@/types/dadata';
import { DadataService } from '@/services/dadata';

// Icons
import IconBase from '@/components/icon-base/icon-base.vue';
import IconPaperclip from '@/components/icons/icon-paperclip.vue';
import IconPencil from '@/components/icons/icon-pencil.vue';

// Components
import PaymentMethod from '@/components/payment-method/payment-method.vue';

@Component({
  mixins: [validationMixin],
  components: {
    IconBase,
    IconPaperclip,
    IconPencil,
    PaymentMethod,
  },
  validations(this: Requisites) {
    return {
      newBankRequisites: {
        bank_name: {
          required,
        },
        detail_name: {
          required,
        },
        address: {
          required,
        },
        checking_account: {
          required,
          validFormat: (val: string) => this.validRules.regex('checking').test(val),
          validLegal: (val: string) => this.validRules.regex('legal').test(val),
        },
        city: {
          required,
        },
        corr_account: {
          required,
          validFormat: (val: string) => this.validRules.regex('corr').test(val),
        },
        bank_identification_code: {
          required,
          validFormat: (val: string) => this.validRules.regex('bic').test(val),
        },
      },
      requisites: {
        company_info: {
          company_name: {
            required,
          },
          inn: {
            required,
            validFormat: (val: string) => this.validRules.regex('inn').test(val),
          },
          kpp: {
            validFormat: (val: string) => this.validRules.regex('kpp').test(val),
          },
          ogrn: {
            required,
            validFormat: (val: string) => this.validRules.regex('ogrn').test(val),
          },
          legal_address: {
            required,
          },
          physical_address: {
            required,
          },
          chief_user_fio: {
            required,
            validFormat: (val: string) => this.validRules.regex('fio').test(val),
          },
          chief_user_position: {
            required,
            validFormat: (val: string) => this.validRules.regex('position').test(val),
          },
          grounds_for_actions: {
            required,
          },
        },
        contacts: {
          contact_user_email: {
            required,
            validFormat: (val: string) => this.validRules.regex('mail').test(val),
          },
          contact_user_fio: {
            required,
            validFormat: (val: string) => this.validRules.regex('fio').test(val),
          },
          contact_user_phone: {
            required,
            validFormat: (val: string) => this.validRules.regex('phone').test(val),
          },
          contact_user_position: {
            required,
            validFormat: (val: string) => this.validRules.regex('position').test(val),
          },
        },
      },
      requisitesIndividual: {
        user_info: {
          fio: {
            required,
            validFormat: (val: string) => this.validRules.regex('fio').test(val),
          },
        },
        contacts: {
          email: {
            required,
            validFormat: (val: string) => this.validRules.regex('mail').test(val),
          },
          phone: {
            required,
            validFormat: (val: string) => this.validRules.regex('phone').test(val),
          },
        },
      },
    };
  },
})
export default class Requisites extends Vue {
  get requisitesData() {
    return RequisitesModule.context(this.$store).state.requisitesData;
  }
  createCompanyInfoAction = RequisitesModule.context(this.$store).actions.createCompanyInfo;
  updateCompanyInfoAction = RequisitesModule.context(this.$store).actions.updateCompanyInfo;
  createContactsAction = RequisitesModule.context(this.$store).actions.createContacts;
  updateContactsAction = RequisitesModule.context(this.$store).actions.updateContacts;
  createContactsIndividualAction = RequisitesModule.context(this.$store).actions.createContactsIndividual;
  updateContactsIndividualAction = RequisitesModule.context(this.$store).actions.updateContactsIndividual;
  createBankRequisitesAction = RequisitesModule.context(this.$store).actions.createBankRequisites;
  updateDefaultBankRequisitesAction = RequisitesModule.context(this.$store).actions.updateDefaultBankRequisites;

  isLegal = true;
  isIndividual = false;

  requisites: LegalRequisites = {
    company_info: {
      chief_user_fio: '',
      chief_user_position: '',
      company_name: '',
      grounds_for_actions: '',
      inn: '',
      kpp: '',
      legal_address: '',
      ogrn: '',
      physical_address: '',
    },
    bank_requisites: [],
    contacts: {
      contact_user_fio: '',
      contact_user_email: '',
      contact_user_phone: '',
      contact_user_position: '',
    },
  };

  requisitesIndividual: IndividualRequisites = {
    user_info: {
      fio: '',
    },
    bank_requisites: [],
    contacts: {
      phone: '',
      email: '',
    },
  };

  showModal = false;

  suggestionsItemHeight = '2rem';

  loadIcon = {
    company_info: false,
    contacts: false,
    contactsIndividual: false,
  };

  responceAwaiting = false;

  validRules = validRules;

  // ==================================
  // ========== COMPANY INFO ==========
  // ==================================
  searchCompany = '';
  searchCompanyFocus = false;
  suggestionsCompany: CompanyInfo[] = [];
  currentCompanyInfo = {} as CompanyInfo;
  showEditCompanyInfo = false;

  get showCompanySuggestions(): boolean {
    return this.suggestionsCompany.length !== 0 && this.searchCompanyFocus;
  }
  get companySuggestionsHeight() {
    return `calc(${this.suggestionsItemHeight} * ${this.suggestionsCompany.length})`;
  }
  get isReceivedCompanyInfoEmpty() {
    return Object.entries(this.requisitesData.company_info).every(([key, value]) => {
      return key === 'info_id' || value === '';
    });
  }
  get hasDataInCompanyInfoForm(): boolean {
    return Object.keys(this.requisites.company_info).some(
      (key: keyof CompanyInfo) => key !== 'info_id' && this.requisites.company_info[key] !== ''
    );
  }
  get isCompanyInfoUpdated(): boolean {
    return Object.keys(this.requisites.company_info).some((key: keyof CompanyInfo) => {
      return this.currentCompanyInfo[key] !== this.requisites.company_info[key];
    });
  }
  get isCompanyInfoValid() {
    return !this.$v.requisites.company_info.$invalid;
  }

  editCompanyInfo() {
    this.currentCompanyInfo = { ...this.requisites.company_info };
    this.searchCompany = this.requisites.company_info.company_name;
    this.showEditCompanyInfo = true;
  }

  saveCompanyInfo() {
    if (this.isCompanyInfoUpdated) {
      this.loadIcon.company_info = true;
      const companyInfo = { ...this.requisites.company_info };
      delete companyInfo.info_id;
      const info_id = this.requisites.company_info.info_id;
      if (info_id) {
        this.updateCompanyInfoAction({ id: info_id, companyInfo })
          .catch(() => {
            this.requisites.company_info = this.currentCompanyInfo;
          })
          .finally(() => {
            this.currentCompanyInfo = {} as CompanyInfo;
            this.showEditCompanyInfo = false;
            this.loadIcon.company_info = false;
            this.$v.requisites.contacts.$reset();
          });
      } else {
        this.createCompanyInfoAction(companyInfo)
          .then((info_id: CompanyInfo['info_id']) => {
            this.requisites.company_info.info_id = info_id;
            this.showEditCompanyInfo = false;
          })
          .catch(() => {
            this.requisites.company_info = this.currentCompanyInfo;
            this.searchCompany = '';
          })
          .finally(() => {
            this.currentCompanyInfo = {} as CompanyInfo;
            this.loadIcon.company_info = false;
            this.$v.requisites.contacts.$reset();
          });
      }
    } else {
      this.currentCompanyInfo = {} as CompanyInfo;
      this.showEditCompanyInfo = false;
    }
  }

  @Watch('searchCompany')
  searchCompanyWatcher(val: string) {
    if (val === this.requisites.company_info.company_name && val !== '') {
      this.suggestionsCompany = [];
      return;
    } else if (this.hasDataInCompanyInfoForm) {
      this.resetCompanyInfo();
    }
    if (val !== '') {
      this.dadataCompanyRequestDebounced(val);
    } else {
      this.dadataCompanyRequestDebounced.cancel();
      this.suggestionsCompany = [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dadataCompanyRequestDebounced = debounce(this.dadataCompanyRequest, 500);
  dadataCompanyRequest(query: string) {
    DadataService.dadata
      .party({ query: query })
      .then((result: DadataSuggestionsResponseData<DadataPartyItem>) => {
        if (this.searchCompany !== '') {
          this.suggestionsCompany = result.suggestions.map(suggestion => {
            return {
              company_name: suggestion.value,
              inn: suggestion.data.inn,
              kpp: suggestion.data.kpp || '',
              ogrn: suggestion.data.ogrn,
              legal_address: suggestion.data.address.value,
              physical_address: '',
              chief_user_fio: suggestion.data.management?.name ?? '',
              chief_user_position: suggestion.data.management?.post ?? '',
              grounds_for_actions: '',
            };
          });
        }
      })
      .catch(console.error); // eslint-disable-line no-console
  }

  resetCompanyInfo() {
    const company_info = this.requisites.company_info;
    Object.keys(company_info).forEach((key: keyof CompanyInfo) => {
      if (key !== 'info_id') company_info[key] = '';
    });
  }

  selectCompanySuggestion(suggestion: CompanyInfo) {
    this.searchCompany = suggestion.company_name;
    this.requisites.company_info = { ...this.requisites.company_info, ...suggestion };
    this.$v.requisites.company_info.$touch();
  }

  // ==================================
  // ========== USER INFO ==========
  // ==================================
  currentUserInfo: UserInfo = null;
  showEditUserInfo = true;

  // =====================================
  // ========== BANK REQUISITES ==========
  // =====================================
  searchBank = '';
  searchBankFocus = false;
  suggestionsBank: BankRequisites[] = [];
  newBankRequisites: Omit<BankRequisites, 'default_detail'> = {
    address: '',
    bank_identification_code: '',
    bank_name: '',
    city: '',
    corr_account: '',
    checking_account: '',
    detail_name: '',
  };

  get showBankSuggestions(): boolean {
    return this.suggestionsBank.length !== 0 && this.searchBankFocus;
  }
  get bankSuggestionsHeight() {
    return `calc(${this.suggestionsItemHeight} * ${this.suggestionsBank.length})`;
  }
  get hasDataInBankRequisitesForm(): boolean {
    return Object.values(this.newBankRequisites).some(val => val !== '');
  }
  get isNewBankRequisitesValid() {
    return !this.$v.newBankRequisites.$invalid;
  }

  addBankRequisites() {
    let reqs: LegalRequisites | IndividualRequisites;
    if (this.isIndividual) {
      reqs = this.requisitesIndividual;
    } else {
      reqs = this.requisites;
    }
    if (this.isNewBankRequisitesValid && !this.responceAwaiting) {
      this.responceAwaiting = true;
      this.createBankRequisitesAction(this.newBankRequisites)
        .then((resp: Pick<BankRequisites, 'default_detail' | 'requisite_id'>) => {
          reqs.bank_requisites.push({ ...this.newBankRequisites, ...resp });
        })
        .finally(() => {
          this.resetBankRequisites();
          this.$v.newBankRequisites.$reset();
          this.searchBank = '';
          this.closeModal();
          this.responceAwaiting = false;
        });
    }
  }

  makeBasePaymentMethod(requisite_id: string) {
    let reqs: LegalRequisites | IndividualRequisites;
    if (this.isIndividual) {
      reqs = this.requisitesIndividual;
    } else {
      reqs = this.requisites;
    }
    this.updateDefaultBankRequisitesAction(requisite_id).then(() => {
      reqs.bank_requisites.forEach(requisite => {
        requisite.requisite_id === requisite_id
          ? (requisite.default_detail = true)
          : (requisite.default_detail = false);
      });
    });
  }

  @Watch('searchBank')
  searchBankWatcher(val: string) {
    // Запрет на нецифры
    if (val.match(/\D+/) !== null) {
      this.searchBank = '';
      return;
    }

    if (val === this.newBankRequisites.bank_identification_code && val !== '') {
      this.suggestionsBank = [];
    } else if (this.hasDataInBankRequisitesForm) {
      this.resetBankRequisites('detail_name');
    }

    if (val !== '') {
      this.dadataBankRequestDebounced(val);
    } else {
      this.dadataBankRequestDebounced.cancel();
      this.suggestionsBank = [];
    }
  }

  dadataBankRequestDebounced = debounce(this.dadataBankRequest, 500);
  dadataBankRequest(query: string) {
    DadataService.dadata
      .bank({ query: query })
      .then((result: DadataSuggestionsResponseData<DadataBankItem>) => {
        if (this.searchBank !== '') {
          this.suggestionsBank = result.suggestions.map(suggestion => {
            return {
              address: suggestion.data.address.value,
              bank_identification_code: suggestion.data.bic,
              bank_name: suggestion.value,
              checking_account: '',
              city: suggestion.data.payment_city,
              corr_account: suggestion.data.correspondent_account,
              detail_name: this.newBankRequisites.detail_name,
            };
          });
        }
      })
      .catch(console.error); // eslint-disable-line no-console
  }

  resetBankRequisites(excludeKey = '') {
    Object.keys(this.newBankRequisites).forEach((key: keyof Omit<BankRequisites, 'default_detail'>) => {
      if (key !== excludeKey) this.newBankRequisites[key] = '';
    });
  }

  selectBankSuggestion(suggestion: BankRequisites) {
    this.searchBank = suggestion.bank_identification_code;
    this.newBankRequisites = { ...suggestion };
    this.$v.newBankRequisites.$touch();
  }

  openModal() {
    document.body.style.width = getComputedStyle(document.body).width;
    this.showModal = true;
    const scrollPosition = `-${window.scrollY}px`;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = scrollPosition;
  }

  closeModal() {
    document.body.style.width = '';
    this.showModal = false;
    document.body.style.overflow = 'initial';
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  focusToBic() {
    (this.$refs.bic as HTMLInputElement).focus();
  }

  // ==========================================
  // ========== BANK CARD REQUISITES ==========
  // ==========================================

  // ==============================
  // ========== CONTACTS ==========
  // ==============================

  // Legal contacts
  // ==============================
  currentContacts = {} as Contacts;
  showEditContacts = false;

  get isReceivedContactsEmpty() {
    return Object.entries(this.requisitesData.contacts).every(([key, value]) => {
      return key === 'info_id' || value === '';
    });
  }
  get isContactsUpdated(): boolean {
    return Object.keys(this.requisites.contacts).some((key: keyof Contacts) => {
      return this.currentContacts[key] !== this.requisites.contacts[key];
    });
  }
  get isContactsValid() {
    return !this.$v.requisites.contacts.$invalid;
  }
  editContacts() {
    this.currentContacts = { ...this.requisites.contacts };
    this.showEditContacts = true;
  }
  saveContacts() {
    if (this.isContactsUpdated) {
      this.loadIcon.contacts = true;
      const contacts = { ...this.requisites.contacts };
      delete contacts.info_id;
      const info_id = this.requisites.contacts.info_id;
      if (info_id) {
        this.updateContactsAction({ id: info_id, contacts })
          .catch(() => {
            this.requisites.contacts = this.currentContacts;
          })
          .finally(() => {
            this.currentContacts = {} as Contacts;
            this.showEditContacts = false;
            this.loadIcon.contacts = false;
            this.$v.requisites.contacts.$reset();
          });
      } else {
        this.createContactsAction(contacts)
          .then((info_id: Contacts['info_id']) => {
            this.requisites.contacts.info_id = info_id;
            this.showEditContacts = false;
          })
          .catch(() => {
            this.requisites.contacts = this.currentContacts;
          })
          .finally(() => {
            this.currentContacts = {} as Contacts;
            this.loadIcon.contacts = false;
            this.$v.requisites.contacts.$reset();
          });
      }
    } else {
      this.currentContacts = {} as Contacts;
      this.showEditContacts = false;
    }
  }

  // Individual contacts
  // ==============================
  currentContactsIndividual = {} as ContactsIndividual;
  showEditContactsIndividual = true;

  get isContactsIndividualUpdated(): boolean {
    return Object.keys(this.requisitesIndividual.contacts).some((key: keyof ContactsIndividual) => {
      return this.currentContactsIndividual[key] !== this.requisitesIndividual.contacts[key];
    });
  }
  get isContactsIndividualValid() {
    return !this.$v.requisitesIndividual.contacts.$invalid;
  }
  editContactsIndividual() {
    this.currentContactsIndividual = { ...this.requisitesIndividual.contacts };
    this.showEditContactsIndividual = true;
  }
  saveContactsIndividual() {
    if (this.isContactsIndividualUpdated) {
      this.loadIcon.contactsIndividual = true;
      const contacts = { ...this.requisitesIndividual.contacts };
      delete contacts.info_id;
      const info_id = this.requisitesIndividual.contacts.info_id;
      if (info_id) {
        this.updateContactsIndividualAction({ id: info_id, contacts })
          .catch(() => {
            this.requisitesIndividual.contacts = this.currentContactsIndividual;
          })
          .finally(() => {
            this.currentContactsIndividual = {} as ContactsIndividual;
            this.showEditContactsIndividual = false;
            this.loadIcon.contactsIndividual = false;
            this.$v.requisitesIndividual.contacts.$reset();
          });
      } else {
        this.createContactsIndividualAction(contacts)
          .then((info_id: ContactsIndividual['info_id']) => {
            this.requisitesIndividual.contacts.info_id = info_id;
            this.showEditContactsIndividual = false;
          })
          .catch(() => {
            this.requisitesIndividual.contacts = this.currentContactsIndividual;
          })
          .finally(() => {
            this.currentContactsIndividual = {} as ContactsIndividual;
            this.loadIcon.contactsIndividual = false;
            this.$v.requisitesIndividual.contacts.$reset();
          });
      }
    } else {
      this.currentContactsIndividual = {} as ContactsIndividual;
      this.showEditContactsIndividual = false;
    }
  }

  // CREATED HOOK
  created() {
    if (this.requisitesData.company_info && !this.isReceivedCompanyInfoEmpty) {
      this.requisites.company_info = this.requisitesData.company_info;
    } else this.editCompanyInfo();

    if (this.requisitesData.bank_requisites) {
      this.requisites.bank_requisites = this.requisitesData.bank_requisites;
    }

    if (this.requisitesData.contacts && !this.isReceivedContactsEmpty) {
      this.requisites.contacts = this.requisitesData.contacts;
    } else this.editContacts();
  }
}
