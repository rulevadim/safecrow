// check API before use this types

const dadataPartyResponseItemExample = {
  value: 'ПАО СБЕРБАНК',
  unrestricted_value: 'ПАО СБЕРБАНК',
  data: {
    kpp: '773601001',
    capital: null as any,
    management: {
      name: 'Греф Герман Оскарович',
      post: 'ПРЕЗИДЕНТ, ПРЕДСЕДАТЕЛЬ ПРАВЛЕНИЯ',
      disqualified: null as any,
    },
    founders: null as any,
    managers: null as any,
    branch_type: 'MAIN',
    branch_count: 88,
    source: null as any,
    qc: null as any,
    hid: '145a83ab38c9ad95889a7b894ce57a97cf6f6d5f42932a71331ff18606edecc6',
    type: 'LEGAL',
    state: {
      status: 'ACTIVE',
      actuality_date: 1564012800000,
      registration_date: 677376000000,
      liquidation_date: null as any,
    },
    opf: {
      type: '2014',
      code: '12247',
      full: 'Публичное акционерное общество',
      short: 'ПАО',
    },
    name: {
      full_with_opf: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "СБЕРБАНК РОССИИ"',
      short_with_opf: 'ПАО СБЕРБАНК',
      latin: null as any,
      full: 'СБЕРБАНК РОССИИ',
      short: 'СБЕРБАНК',
    },
    inn: '7707083893',
    ogrn: '1027700132195',
    okpo: null as any,
    okved: '64.19',
    okveds: null as any,
    authorities: null as any,
    documents: null as any,
    licenses: null as any,
    finance: null as any,
    address: {
      value: 'г Москва, ул Вавилова, д 19',
      unrestricted_value: 'г Москва, Академический р-н, ул Вавилова, д 19',
      data: null as any,
    },
    phones: null as any,
    emails: null as any,
    ogrn_date: 1029456000000,
    okved_type: '2014',
    employee_count: null as any,
  },
};

const dadataBankResponseItemExample = {
  value: 'СБЕРБАНК РОССИИ',
  unrestricted_value: 'СБЕРБАНК РОССИИ',
  data: {
    opf: {
      type: 'BANK',
      full: null as any,
      short: null as any,
    },
    name: {
      payment: 'ПАО СБЕРБАНК',
      full: null as any,
      short: 'СБЕРБАНК РОССИИ',
    },
    bic: '044525225',
    swift: 'SABRRUMMXXX',
    okpo: null as any,
    correspondent_account: '30101810400000000225',
    registration_number: '1481',
    payment_city: 'г. Москва',
    state: {
      status: 'ACTIVE',
      actuality_date: 1564532138000,
      registration_date: 677376000000,
      liquidation_date: null as any,
    },
    rkc: null as any,
    address: {
      value: 'г Москва, ул Вавилова, д 19',
    },
    phones: null as any,
  },
};

export type DadataSuggestionsResponseData<T> = {
  suggestions: T[];
};

export type DadataPartyItem = typeof dadataPartyResponseItemExample;
export type DadataBankItem = typeof dadataBankResponseItemExample;
