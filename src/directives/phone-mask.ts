import { DirectiveBinding } from 'vue/types/options';

function spliceString(str: string, index: number, count?: number, add?: string) {
  const ar = str.split('');
  count ? (add ? ar.splice(index, count, add) : ar.splice(index, count)) : ar.splice(index);
  return ar.join('');
}

class MaskInput {
  el: HTMLInputElement;
  mask: string;
  start: string;
  maxMaskDigits: number;
  resultString = '';
  resultPosition = 0;

  constructor(el: HTMLElement, mask: string) {
    this.el = el as HTMLInputElement;
    // this.el.value = "";
    this.mask = mask;
    this.start = mask.slice(0, mask.indexOf('#'));
    if (el.dataset.oldval === undefined) {
      el.dataset.oldval = this.masking(this.el.value);
    }
    if (/#/.test(mask)) {
      this.maxMaskDigits = mask.match(/(\d|#)/g)!.length;
    } else {
      this.maxMaskDigits = 0;
      // eslint-disable-next-line no-console
      console.error("[v-phone-mask] mask doesn't containg a digit token");
    }
  }

  get isFocused() {
    return this.el === document.activeElement;
  }

  get val() {
    return this.el.value;
  }

  set val(newVal: string) {
    this.el.value = newVal;
  }

  get oldVal() {
    return this.el.dataset.oldval!;
  }

  set oldVal(newVal: string) {
    this.el.dataset.oldval = newVal;
  }

  get rawVal() {
    return this.val.replace(/\D+/g, '');
  }

  get delta() {
    return this.val.length - this.oldVal.length;
  }

  get posEnd() {
    return this.el.selectionEnd!;
  }

  get posStart() {
    return Number(this.el.dataset.posstart);
  }

  set posStart(newVal: number) {
    this.el.dataset.posstart = `${newVal}`;
  }

  get rawPosEnd() {
    return this.rawPos(this.posEnd);
  }

  get replacement() {
    return this.el.dataset.replacement === 'true';
  }

  set replacement(newVal: boolean) {
    this.el.dataset.replacement = newVal ? 'true' : 'false';
  }

  get change(): 'insert' | 'delete' | 'replacement' | 'none' {
    if (this.replacement) return 'replacement';
    return this.delta === 0 ? 'none' : this.delta > 0 ? 'insert' : 'delete';
  }

  get sub() {
    if (this.change === 'delete') {
      if (this.posStart === this.posEnd) {
        return this.oldVal.substring(this.posStart, this.posEnd + 1);
      } else {
        return this.oldVal.substring(this.posStart, this.posEnd);
      }
    } else {
      return this.val.substring(this.posStart, this.posEnd);
    }
  }

  get isSubCharMask() {
    return this.sub.length === 1 ? /\D/.test(this.sub) : undefined;
  }

  masking(str: string) {
    const strAr = str.replace(/\D+/g, '').substr(0, this.maxMaskDigits).split('');
    let index = 0;
    for (const symbol of this.mask) {
      if (symbol !== '#' && symbol !== strAr[index]) {
        strAr.splice(index, 0, symbol);
      }
      if (strAr.length === index + 1) break;
      index++;
    }

    str = strAr.join('');

    if (str.length < this.start.length) str = this.start;

    return str;
  }

  fire() {
    this.el.dispatchEvent(new Event('input'));
  }

  rawPos(pos: number) {
    // Если pos > длины маски возникнет ошибка, обходим ее
    if (pos > this.mask.length) return this.maxMaskDigits;

    let rawPos = 0;
    for (let i = 0; i < pos; i++) {
      if (/\d/.test(this.change === 'insert' ? this.val[i] : this.oldVal[i])) {
        rawPos++;
      }
    }
    return rawPos;
  }

  maskPos(pos: number) {
    let maskPos = pos;
    for (const symbol of this.mask) {
      if (symbol !== '#' && !symbol.match(/\d/)) {
        maskPos++;
      } else if (this.change === 'insert' ? pos-- === 0 : --pos === 0) break;
    }
    if (maskPos < this.start.length) maskPos = this.start.length;
    return maskPos;
  }

  finish() {
    this.val = `${this.resultString}`;

    this.el.setSelectionRange(this.resultPosition, this.resultPosition);
    setTimeout(() => {
      this.el.setSelectionRange(this.resultPosition, this.resultPosition);
    });
    this.oldVal = this.resultString;
    this.posStart = this.resultPosition;
    this.fire();
  }

  onDelete() {
    if (Math.abs(this.delta) === 1) {
      if (this.posStart === this.posEnd) {
        if (this.isSubCharMask === true) {
          this.resultString = this.masking(spliceString(this.rawVal, this.rawPosEnd, 1));
        } else {
          this.resultString = this.masking(this.val);
        }
        this.resultPosition = this.posEnd;
      } else {
        if (this.isSubCharMask === true) {
          this.resultString = this.masking(spliceString(this.rawVal, this.rawPosEnd - 1, 1));
          this.resultPosition = this.maskPos(this.rawPosEnd - 1);
        } else {
          this.resultString = this.masking(this.val);
          this.resultPosition = this.maskPos(this.rawPosEnd);
        }
      }
    } else {
      this.resultString = this.masking(this.val);
      this.resultPosition = this.posEnd;
    }
    this.finish();
  }

  onInsert() {
    this.resultString = this.masking(this.val);
    this.resultPosition = this.maskPos(this.rawPosEnd);
    this.finish();
  }

  onReplacement() {
    this.resultString = this.masking(this.val);
    this.resultPosition = this.resultString.length;
    this.replacement = false;
    this.finish();
  }

  onBind() {
    if (this.val) {
      this.val = this.masking(this.val);
      this.fire();
    } else this.val = '';
  }

  onUpdate() {
    if (this.isFocused) {
      if (this.change === 'replacement') this.onReplacement();
      if (this.posStart < this.start.length || this.posEnd < this.start.length) {
        this.resultString = this.oldVal;
        this.resultPosition = this.start.length;
        this.finish();
      }
      if (this.change === 'delete') {
        this.onDelete();
      } else if (this.change === 'insert') {
        this.onInsert();
      }
    } else if (this.val === '') {
      this.fire();
    } else {
      this.val = this.masking(this.val);
      this.fire();
    }
  }
}

export const phoneMask = {
  bind(el: HTMLElement, binding: DirectiveBinding) {
    const input = new MaskInput(el, binding.value);
    input.el.addEventListener(
      'focus',
      () => {
        if (input.val === '') {
          input.val = input.start;
          setTimeout(() => {
            input.el.setSelectionRange(input.start.length, input.start.length);
          });
          input.el.dispatchEvent(new Event('input'));
        }
      },
      false
    );
    input.el.addEventListener(
      'blur',
      () => {
        if (input.val.length <= input.start.length) {
          input.val = '';
          input.el.dispatchEvent(new Event('input'));
        }
      },
      false
    );
    input.el.addEventListener(
      'keydown',
      () => {
        input.posStart = input.el.selectionEnd!;
      },
      false
    );
    input.el.addEventListener(
      'keypress',
      () => {
        input.posStart = input.el.selectionEnd!;
      },
      false
    );
    input.el.addEventListener(
      'paste',
      event => {
        const paste = event.clipboardData!.getData('text');
        const selection = window.getSelection()!.toString();
        if (paste && selection) {
          const selectionRaw = selection.replace(/\D+/g, '');
          if (selectionRaw === input.rawVal || selectionRaw === input.rawVal.slice(1)) {
            input.replacement = true;
          }
        }
      },
      false
    );
    input.onBind();
  },

  update(el: HTMLElement, binding: DirectiveBinding) {
    const input = new MaskInput(el, binding.value);
    input.onUpdate();
  },
};
