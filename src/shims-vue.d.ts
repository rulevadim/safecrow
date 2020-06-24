declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'dadata-suggestions' {
  export default class Dadata {
    constructor(apiKey: string);
    apiKey: string;
    address(params: any): Promise<any>;
    bank(params: any): Promise<any>;
    email(params: any): Promise<any>;
    fio(params: any): Promise<any>;
    party(params: any): Promise<any>;
  }
}

declare function ym(counter_id: number | string, event: 'reachGoal', target_name: string): void;

declare function ct(goal: string, jsgoalname: string): void;

declare module 'vue-text-mask';

declare module 'vue-the-mask';

declare module 'vuejs-datepicker';
declare module 'vuejs-datepicker/dist/locale';

declare module 'vue-pdf';
