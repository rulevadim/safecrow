import { Component, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/login-form/login-form.vue';

@Component({
  components: {
    LoginForm,
  },
})
export default class AuthLogin extends Vue {
  redirectPath?: string = '';

  mounted() {
    this.redirectPath = localStorage.getItem('redirectPath');
  }

  onLoginSuccess() {
    localStorage.removeItem('redirectPath');
  }
}
