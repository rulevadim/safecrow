export default {
  length: {
    innMin: 10,
    innMax: 12,
    kpp: 9,
    ogrnMin: 13,
    ogrnMax: 15,
    bankCheckingAccount: 20,
    bankCorrAccount: 20,
    bic: 9,
  },

  regex(field: 'mail' | 'phone' | 'inn' | 'kpp' | 'ogrn' | 'checking' | 'legal' | 'corr' | 'bic' | 'fio' | 'position') {
    switch (field) {
      case 'mail':
        return new RegExp(
          '' +
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))/.source +
            '@' +
            /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source
        );
      case 'phone':
        return /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;
      case 'inn':
        return new RegExp(`^\\d{${this.length.innMin},${this.length.innMax}}$`);
      case 'kpp':
        return new RegExp(`^(\\d{${this.length.kpp}})?$`);
      case 'ogrn':
        return new RegExp(`^\\d{${this.length.ogrnMin},${this.length.ogrnMax}}$`);
      case 'checking':
        return new RegExp(`^\\d{${this.length.bankCheckingAccount}}$`);
      case 'legal':
        return /^(407|40802)/;
      case 'corr':
        return new RegExp(`^\\d{${this.length.bankCorrAccount}}$`);
      case 'bic':
        return new RegExp(`^\\d{${this.length.bic}}$`);
      case 'fio':
        return /^[ а-яё-]+$/i;
      case 'position':
        return /^[ а-яё-]+$/i;
    }
  },

  errors: {
    required: 'Поле обязательно для заполнения',
    fio: 'Введите, пожалуйста, Фамилию, Имя и Отчество руководителя кириллическими символами',
    position: 'Поле может содержать только кириллический текст, пробел и дефис',
    checking: 'Поле должно содержать 20 цифр',
    legal: 'Счет должен начинаться с цифр 407 или 40802',
    mail: 'Неправильный формат почты',
    phone: 'Введите корректный номер телефона',
  },
};
