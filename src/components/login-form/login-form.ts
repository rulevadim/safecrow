import { Component, Prop, Vue } from 'vue-property-decorator';

import { AuthModule } from '@/states/auth';

import { V1AuthService, V1LoginResponseData } from '@/services/auth';
import { AxiosResponse } from 'axios';
import { JwtTokenPayload, TokenStorageService } from '@/services/token-storage';
import MaskedInput from 'vue-text-mask';
import IconBase from '@/components/icon-base/icon-base.vue';

const regexMail = new RegExp(
  '' +
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))/.source +
    '@' +
    /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source
);

const regexPhoneNumber = /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;
const regexPhoneCode = /^\d{6}$/;

const maskPhoneCode = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

const registerByPhoneThrottleSeconds = 60;

@Component({
  components: {
    MaskedInput,
    IconBase,
  },
})
export default class LoginForm extends Vue {
  registerAction = AuthModule.context(this.$store).actions.registerUser;
  loginAction = AuthModule.context(this.$store).actions.loginUser;
  loadRegisterTokenAction = AuthModule.context(this.$store).actions.loadRegisterToken;

  @Prop({ required: true }) readonly isNeedRedirectAfterLogin!: boolean;
  @Prop(String) readonly redirectPath?: string;
  @Prop({ default: false }) readonly disabled?: boolean;
  @Prop({ default: false }) readonly createDeal?: boolean;
  @Prop({ default: false }) readonly uploadingInProgress?: boolean;

  isOpenRuPartner: boolean = process.env.VUE_APP_PARTNER === 'open-ru';

  registerToken = '';

  loginByPhoneData: {
    phone: string;
    code: string;
  } = {
    phone: '',
    code: '',
  };

  loginByEmailData: {
    email: string;
    code: string;
  } = {
    email: '',
    code: '',
  };

  loginByPhoneErrors: Record<string, string> = {
    phone: '',
    code: '',
  };

  maskPhoneCode = maskPhoneCode;

  registerInProgress = false;
  loginInProgress = false;

  isRegisterByEmailSuccess = false;
  isRegisterByPhoneSuccess = false;

  get isLoginByPhone() {
    return !this.loginByEmailData.email.length;
  }
  get isLoginByEmail() {
    return this.loginByPhoneData.phone.length <= 4;
  }

  get isValidPhoneNumber() {
    return regexPhoneNumber.test(this.loginByPhoneData.phone);
  }

  get isValidPhoneCode() {
    return regexPhoneCode.test(this.loginByPhoneData.code);
  }

  get isValidPhoneData() {
    return this.isValidPhoneNumber && this.isValidPhoneCode;
  }

  get isValidEmailData() {
    return regexMail.test(this.loginByEmailData.email);
  }

  get isLoginFormValid() {
    if (this.isLoginByPhone) {
      return this.isValidPhoneData;
    } else if (this.isLoginByEmail) {
      return this.isValidEmailData;
    }
    return false;
  }

  disableRegisterByPhoneButtonTimer: number = registerByPhoneThrottleSeconds;
  disableRegisterByPhoneButtonTimerChangeInterval: number = null;

  pathToLogo = process.env.BASE_URL
    ? process.env.BASE_URL + process.env.VUE_APP_PARTNER_LOGO
    : `/${process.env.VUE_APP_PARTNER_LOGO}`;

  vueAppPartner: string = process.env.VUE_APP_PARTNER;

  loginWithOpenRuInProgress = false;

  registerByPhone() {
    if (this.disableRegisterByPhoneButtonTimerChangeInterval) {
      return;
    }

    this.registerInProgress = true;
    this.loginByPhoneErrors.code = '';

    this.disableRegisterByPhoneButtonTimerChangeInterval = window.setInterval(() => {
      if (this.disableRegisterByPhoneButtonTimer > 0) {
        this.disableRegisterByPhoneButtonTimer--;
      }
    }, 1000);
    setTimeout(() => {
      this.disableRegisterByPhoneButtonTimer = registerByPhoneThrottleSeconds;
      clearInterval(this.disableRegisterByPhoneButtonTimerChangeInterval);
      this.disableRegisterByPhoneButtonTimerChangeInterval = null;
    }, registerByPhoneThrottleSeconds * 1000);

    const clearedPhoneNumber = this.loginByPhoneData.phone.replace(/[^+\d]+/g, '');
    return (
      this.registerAction({ auth: clearedPhoneNumber })
        .then((resp: AxiosResponse<V1LoginResponseData>) => {
          this.registerToken = resp.data.token;
          this.isRegisterByPhoneSuccess = true;
          ((this.$refs.phoneDataCodeInput as Vue).$el as HTMLInputElement).focus();
        })
        // eslint-disable-next-line no-console
        .catch((error: Error) => console.log(error))
        .finally(() => {
          this.registerInProgress = false;
        })
    );
  }

  registerByEmail() {
    this.registerInProgress = true;
    return this.registerAction({ auth: this.loginByEmailData.email })
      .then(() => {
        this.isRegisterByEmailSuccess = true;
        this.$emit('register-by-email-success');
        if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'voiti');
        if (window.hasOwnProperty('ct')) ct('alfa_referral', 'voiti');
      })
      .finally(() => {
        this.registerInProgress = false;
      });
  }

  loginByPhone() {
    Object.keys(this.loginByPhoneErrors).forEach(key => {
      this.loginByPhoneErrors[key] = '';
    });
    this.loginInProgress = true;
    const clearedPhoneCode = this.loginByPhoneData.code.replace(/\D+/g, '');
    return this.loginAction({ auth: clearedPhoneCode, registerToken: this.registerToken })
      .then(() => {
        if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'voiti');
        if (window.hasOwnProperty('ct')) ct('alfa_referral', 'voiti');
        return this.successfulLoginHandler();
      })
      .catch((err: any) => {
        const status = err?.response?.status;
        if (status === 401 && err.response.data.message === 'bad pwd') {
          this.loginByPhoneErrors.code = 'Введен неверный код.';
        } else if (status === 401) {
          this.loginByPhoneErrors.code = 'Сначала нужно получить код.';
        }
        throw err;
      })
      .finally(() => {
        this.loginInProgress = false;
      });
  }

  loginByEmail() {
    this.loginInProgress = true;
    return this.loginAction({ auth: this.loginByEmailData.code, registerToken: this.registerToken })
      .then(() => {
        return this.successfulLoginHandler();
      })
      .finally(() => {
        this.loginInProgress = false;
      });
  }

  onSubmitFormData() {
    if (this.isLoginByPhone) {
      this.loginByPhone();
    } else if (this.isLoginByEmail) {
      this.registerByEmail();
    }
  }

  get computedRedirectPath(): string | object {
    let redirectPath = this.redirectPath;
    if (!redirectPath) {
      redirectPath = Array.isArray(this.$route.query.redirect)
        ? this.$route.query.redirect[0]
        : this.$route.query.redirect;
    }
    return redirectPath || { name: this.$routesNames.home };
  }

  successfulLoginHandler() {
    this.$emit('login-success');
    if (!this.isNeedRedirectAfterLogin) {
      return;
    }
    this.$router.push(this.computedRedirectPath);
  }

  loadRegisterTokenFromStorage() {
    this.loadRegisterTokenAction()
      .then((result: { registerToken: string; registerTokenPayload: JwtTokenPayload }) => {
        this.registerToken = result.registerToken;
      })
      .catch(() => {
        TokenStorageService.removeRegisterToken();
      });
  }

  mounted() {
    const { token, code } = this.$route.query;
    if (token && code) {
      this.registerToken = Array.isArray(token) ? token[0] : token;
      this.loginByEmailData.code = Array.isArray(code) ? code[0] : code;
      this.loginByEmail();
    } else {
      this.loadRegisterTokenFromStorage();
    }
  }

  loginWithOpenRu() {
    let path = '';
    if (typeof this.computedRedirectPath === 'object') {
      path = this.$router.resolve(this.computedRedirectPath).href;
    } else {
      path = this.computedRedirectPath;
    }
    this.loginWithOpenRuInProgress = true;
    V1AuthService.oAuthOpenRuLoginLink()
      .then(resp => {
        window.location.href = `${resp.data.link}&state=redirect=${encodeURIComponent(path)}`;
      })
      .finally(() => {
        this.loginWithOpenRuInProgress = false;
      });
  }
}
