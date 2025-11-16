import { InputMethodManager } from "./input-method-engine";
import { styles } from "zosLoader:./index.[pf].layout.js";
import {
  createWidget,
  deleteWidget,
  updateLayout,
  widget,
  align,
  prop,
  text_style,
  event,
  keyboard,
  setAlpha,
} from "@zos/ui";

function createKeyboard() {
  return createWidget(widget.VIRTUAL_CONTAINER, styles.container);
}

function createWidget2(type, props, layoutParent) {
  return createWidget(type, {
    ...props,
    parent: layoutParent,
  });
}

// словарь
const T9_DICTIONARY = [
  "и", "в", "не", "я", "на", "что", "он", "с", "как", "это", "по", "а", "к", "то", "у", "из", "за", "ты", "мы", "она", "они", "для", "так", "но", "его", "же", "от", "такой", "или", "уже", "когда", "если", "про", "да", "все", "там", "о", "только", "до", "бы", "ещё", "при", "меня", "тебя", "нет", "можно", "ну", "где", "чтобы", "чем", "тут", "здесь", "было", "был", "быть", "будет", "есть", "дела", "сейчас", "тогда", "люди", "жизнь", "очень", "раз", "два", "сам", "под", "после", "тот", "откуда", "почему", "куда", "кто", "что-то", "уходить", "думать", "знать", "говорить", "видеть", "идти", "хорошо", "плохо", "лучше", "может", "нужно", "дом", "день", "разве", "слишком", "почти", "сразу", "никто", "ничто", "вроде", "между", "или",
  "привет", "здравствуйте", "пока", "до свидания", "спасибо", "пожалуйста", "извините", "доброе утро", "добрый день", "добрый вечер", "спокойной ночи", "рад", "рада", "поздравляю", "прошу", "не за что", "будьте добры"
];

DataWidget({
  state: {
    inputText: "",
    inputBuffer: "",
    candidates: [],
    inputMethod: null,
    vc1: null,
    t9Candidates: [],
    recentInput: "",
    t9Widget: null,
  },
  getKeyboard() {
    if (typeof keyboard !== "undefined" && keyboard) {
      return keyboard;
    }
    return null;
  },
  safeSendFnKey(constOrName) {
    const k = this.getKeyboard();
    if (!k || typeof k.sendFnKey !== "function") {
      console.log("safeSendFnKey: клавиатура недоступна");
      return;
    }
    try {
      const val = typeof constOrName === "string" && k[constOrName] !== undefined ? k[constOrName] : constOrName;
      k.sendFnKey(val);
    } catch (e) {
      console.log("Ошибка при отправке клавиши:", e);
    }
  },
  safeInputText(text) {
    const k = this.getKeyboard();
    if (k && typeof k.inputText === "function") {
      try {
        k.inputText(text);
      } catch (e) {
        console.log("Ошибка при вводе текста:", e);
      }
    } else {
      console.log("Клавиатура недоступна, текст сохранён локально");
      this.setState({ inputText: this.state.inputText + text });
    }
  },
  safeInputBuffer(buffer, color1, color2) {
    const k = this.getKeyboard();
    if (k && typeof k.inputBuffer === "function") {
      try {
        k.inputBuffer(buffer, color1, color2);
      } catch (e) {
        console.log("Ошибка при вводе буфера:", e);
      }
    } else {
      console.log("Клавиатура не поддерживает inputBuffer");
    }
  },
  safeClearInput() {
    const k = this.getKeyboard();
    if (k && typeof k.clearInput === "function") {
      try {
        k.clearInput();
      } catch (e) {
        console.log("Ошибка при очистке ввода:", e);
      }
    } else {
      console.log("Клавиатура недоступна, очистка локально");
      this.setState({
        inputBuffer: "",
        candidates: [],
        recentInput: "",
        t9Candidates: [],
      });
    }
  },
  safeGetTextContext() {
    const k = this.getKeyboard();
    if (k && typeof k.getTextContext === "function") {
      try {
        return k.getTextContext();
      } catch (e) {
        console.log("Ошибка при получении контекста:", e);
        return null;
      }
    }
    return null;
  },
  setState(state) {
    for (const key in state) {
      this.state[key] = state[key];
    }
    if (this.state.vc1) {
      this.renderCandidates(this.state.vc1);
    }
  },
  onInit() {
    console.log("Инициализация виджета");
    try {
      this.state.inputMethod = new InputMethodManager();
    } catch (e) {
      console.log("Ошибка инициализации InputMethodManager, используем фоллбек:", e);
      this.state.inputMethod = {
        currentMethod: "pinyin",
        getCurrentMethod: function() {
          return {
            getCandidates: function() { return []; },
            handleSelect: function() {}
          };
        }
      };
    }
  },
  renderCandidates(vc1) {
    if (!vc1) {
      console.log("Контейнер не определён, пропускаем отрисовку");
      return;
    }
    try {
      this.commitTextBuffer();
    } catch (e) {
      console.log("Ошибка при фиксации буфера:", e);
    }
    const children = vc1.layoutChildren || [];
    children.forEach((c) => {
      try {
        deleteWidget(c);
      } catch (e) {
        console.log("Ошибка при удалении виджета:", e);
      }
    });
    vc1.layoutChildren = [];
    // Центрируем контейнер для подсказки из словарика
    const centerContainer = createWidget2(
      widget.VIRTUAL_CONTAINER,
      {
        layout: {
          display: "flex",
          flex_grow: "1",
          justify_content: "center",
          align_items: "center",
          min_width: "0",
          height: "100%",
        },
      },
      vc1
    );
    // удаляем старую подсказку, если есть
    if (this.state.t9Widget) {
      try {
        deleteWidget(this.state.t9Widget);
      } catch (e) {
        // игнорируем ошибки, если уже удалён
      }
      this.state.t9Widget = null;
    }
    // Отрисовываем T9-подсказку, если есть кандидаты
    if (this.state.t9Candidates.length > 0 && this.state.recentInput.length > 0) {
      const t9Word = this.state.t9Candidates[0];
      const t9Btn = createWidget2(
        widget.BUTTON,
        {
          ...styles.t9Button,
          text: t9Word,
          click_func: (e) => {
            this.selectT9Candidate(t9Word);
          },
        },
        centerContainer
      );
      this.state.t9Widget = t9Btn;
    }
    // Кнопка удалить
    const deleteBtnContainer = createWidget2(
      widget.VIRTUAL_CONTAINER,
      {
        layout: {
          display: "flex",
          justify_content: "center",
          align_items: "center",
          width: "64",
          height: "100%",
          margin_left: "10",
        },
      },
      vc1
    );
    const deleteBtn = createWidget2(
      widget.BUTTON,
      {
        layout: {
          width: "64",
          height: "64",
          tags: "ignore-layout",
        },
        click_func: (e) => {
          this.delete();
        },
        longpress_func: () => {
          this.deleteAll();
        },
      },
      deleteBtnContainer
    );
    if (deleteBtn && deleteBtn.setAlpha) {
      deleteBtn.setAlpha(0);
    }
    createWidget2(
      widget.IMG,
      {
        src: "image/del.png",
        enable: false,
        layout: {
          width: "64",
          height: "64",
        },
      },
      deleteBtnContainer
    );
    try {
      updateLayout(vc1);
    } catch (e) {
      console.log("Ошибка при обновлении layout:", e);
    }
  },
  build() {
    try {
      const vc = createKeyboard();
      this.state.vc1 = createWidget2(
        widget.VIRTUAL_CONTAINER,
        styles.candidateBar,
        vc
      );
      if (this.state.vc1) {
        this.renderCandidates(this.state.vc1);
      }
      const vc2 = createWidget2(widget.VIRTUAL_CONTAINER, styles.keyboard, vc);
      this.renderCurrentInputKeys(vc2);
      this.renderActionKeys(vc2);
    } catch (e) {
      console.log("Ошибка при сборке интерфейса:", e);
    }
  },
  getT9Predictions(input) {
    if (!input || input.length < 1) {
      return [];
    }
    const lowerInput = input.toLowerCase();
    const lastChars = lowerInput.slice(-5);
    let exactMatches = T9_DICTIONARY.filter(word =>
      word.toLowerCase().startsWith(lastChars)
    );
    if (exactMatches.length === 0 && lastChars.length >= 3) {
      exactMatches = T9_DICTIONARY.filter(word =>
        word.toLowerCase().startsWith(lastChars.slice(-3))
      );
    }
    if (exactMatches.length === 0 && lastChars.length >= 2) {
      exactMatches = T9_DICTIONARY.filter(word =>
        word.toLowerCase().startsWith(lastChars.slice(-2))
      );
    }
    if (exactMatches.length === 0 && lastChars.length >= 1) {
      exactMatches = T9_DICTIONARY.filter(word =>
        word.toLowerCase().startsWith(lastChars.slice(-1))
      );
    }
    return exactMatches.length > 0 ? [exactMatches[0]] : [];
  },
  renderCurrentInputKeys(vc) {
    const inputMethodObj = this.state.inputMethod || {};
    const currentMethodName = typeof inputMethodObj.currentMethod === "string"
      ? inputMethodObj.currentMethod
      : "pinyin";
    const keys = [
      ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х"],
      ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
      ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"],
    ];
    return keys.map((row, rowIndex) => {
      const isLastRow = rowIndex === keys.length - 1;
      const keyCount = row.length;
      const isCrowded = keyCount > 10;
      const row_w = createWidget(widget.VIRTUAL_CONTAINER, {
        parent: vc,
        ...styles.keyboardRow,
        layout: {
          ...styles.keyboardRow.layout,
          column_gap: isCrowded ? "1" : (isLastRow ? "1" : styles.keyboardRow.layout.column_gap),
          padding_left: (isCrowded || isLastRow) ? "2" : (styles.keyboardRow.layout.padding_left || undefined),
          padding_right: (isCrowded || isLastRow) ? "2" : (styles.keyboardRow.layout.padding_right || undefined),
        },
      });
      return row.map((key) => {
        const keyLayout = {
          ...styles.keyButton,
          layout: {
            ...styles.keyButton.layout,
            width: isCrowded ? "8.2%" : (isLastRow ? "9.1%" : styles.keyButton.layout.width),
          },
        };
        return createWidget(widget.BUTTON, {
          ...keyLayout,
          parent: row_w,
          text: key,
          click_func: (e) => {
            this.handleKeyPress(key);
          },
          longpress_func: () => {
            if (key === "е") {
              this.safeInputText("ё");
            } else if (key === "ь") {
              this.safeInputText("ъ");
            }
          }
        });
      });
    });
  },
  renderActionKeys(vc) {
    const vc3 = createWidget2(
      widget.VIRTUAL_CONTAINER,
      {
        layout: {
          ...styles.keyboardRow.layout,
          justify_content: "center",
        },
      },
      vc
    );
    // Кнопка смены языка
    let vc4 = createWidget2(
      widget.VIRTUAL_CONTAINER,
      {
        layout: {
          ...styles.toggleLang.layout,
          display: "flex",
          justify_content: "center",
          align_items: "center",
          align_content: "center",
          width: "18%",
          margin_right: "-25",
          margin_top: "-5",
        },
      },
      vc3
    );
    let btn = createWidget2(
      widget.BUTTON,
      {
        layout: {
          top: "0",
          width: "100%",
          height: "100%",
          tags: "ignore-layout",
        },
        click_func: () => {
          this.toggleLanguage();
        },
        longpress_func: () => {
          this.toggleSelect();
        },
      },
      vc4
    );
    if (btn && btn.setAlpha) {
      btn.setAlpha(0);
    }
    createWidget2(
      widget.IMG,
      {
        src: "image/globe.png",
        enable: false,
        layout: {
          width: "64",
          height: "64",
        },
      },
      vc4
    );
    // Кнопка пробела
    const spaceBtnContainer = createWidget2(
      widget.VIRTUAL_CONTAINER,
      {
        layout: {
          display: "flex",
          justify_content: "center",
          align_items: "center",
          width: "64",
          height: "100%",
          margin_left: "10",
        },
      },
      vc3
    );
    const spaceBtn = createWidget2(
      widget.BUTTON,
      {
        layout: {
          width: "64",
          height: "64",
          tags: "ignore-layout",
        },
        click_func: (e) => {
          this.handleKeyPress(" ");
        },
      },
      spaceBtnContainer
    );
    if (spaceBtn && spaceBtn.setAlpha) {
      spaceBtn.setAlpha(0);
    }
    createWidget2(
      widget.IMG,
      {
        src: "image/space.png",
        enable: false,
        layout: {
          width: "64",
          height: "64",
        },
      },
      spaceBtnContainer
    );
    // Кнопка Enter (заменена на tick.png)
    const enterBtnContainer = createWidget2(
      widget.VIRTUAL_CONTAINER,
      {
        layout: {
          ...styles.toggleLang.layout,
          display: "flex",
          justify_content: "center",
          align_items: "center",
          align_content: "center",
          width: "18%",
          margin_left: "-25",
          margin_top: "-5",
        },
      },
      vc3
    );
    const enterBtn = createWidget2(
      widget.BUTTON,
      {
        layout: {
          top: "0",
          width: "100%",
          height: "100%",
          tags: "ignore-layout",
        },
        click_func: (e) => {
          if (this.safeGetTextContext()) {
            this.enter();
          } else {
            this.cancel();
          }
        },
      },
      enterBtnContainer
    );
    if (enterBtn && enterBtn.setAlpha) {
      enterBtn.setAlpha(0);
    }
    createWidget2(
      widget.IMG,
      {
        src: "image/tick.png",
        enable: false,
        layout: {
          width: "64",
          height: "64",
        },
      },
      enterBtnContainer
    );
  },
  handleKeyPress(key) {
    const inputMethodObj = this.state.inputMethod || {};
    const currentMethodName = typeof inputMethodObj.currentMethod === "string" ? inputMethodObj.currentMethod : "pinyin";
    if (currentMethodName === 'pinyin') {
      this.commitText(key);
      let newRecentInput = this.state.recentInput;
      if (key === " ") {
        newRecentInput = "";
      } else if (key.length === 1 && /[а-яёА-ЯЁ]/.test(key)) {
        newRecentInput = newRecentInput + key.toLowerCase();
        if (newRecentInput.length > 5) {
          newRecentInput = newRecentInput.slice(-5);
        }
      }
      const t9Predictions = newRecentInput.length > 0 ? this.getT9Predictions(newRecentInput) : [];
      this.setState({
        inputBuffer: "",
        candidates: [],
        recentInput: newRecentInput,
        t9Candidates: t9Predictions,
      });
    } else {
      const currentMethod = (this.state.inputMethod && typeof this.state.inputMethod.getCurrentMethod === "function")
        ? this.state.inputMethod.getCurrentMethod()
        : null;
      const nextBuffer = this.state.inputBuffer + key;
      this.setState({
        inputBuffer: nextBuffer,
        candidates: currentMethod && typeof currentMethod.getCandidates === "function" ? currentMethod.getCandidates(nextBuffer) : [],
      });
    }
  },
  selectCandidate(word) {
    const currentMethod = (this.state.inputMethod && typeof this.state.inputMethod.getCurrentMethod === "function")
      ? this.state.inputMethod.getCurrentMethod()
      : null;
    if (currentMethod && typeof currentMethod.handleSelect === "function") {
      currentMethod.handleSelect(word);
    }
    const inputText = this.state.inputText + word;
    this.setState({
      inputText: "",
      inputBuffer: "",
      candidates: [],
    });
    this.commitText(inputText);
  },
  selectT9Candidate(word) {
    for (let i = 0; i < this.state.recentInput.length; i++) {
      this.safeSendFnKey('BACKSPACE');
    }
    this.safeInputText(word + " ");
    this.setState({
      recentInput: "",
      t9Candidates: [],
    });
  },
  toggleLanguage() {
    this.toggle();
    this.setState({
      inputBuffer: "",
      candidates: [],
    });
  },
  toggleSelect() {
    this.safeSendFnKey('SELECT');
  },
  toggle() {
    this.safeSendFnKey('SWITCH');
  },
  delete() {
    this.safeSendFnKey('BACKSPACE');
    if (this.state.recentInput.length > 0) {
      const newRecentInput = this.state.recentInput.slice(0, -1);
      const t9Predictions = this.getT9Predictions(newRecentInput);
      this.setState({
        recentInput: newRecentInput,
        t9Candidates: t9Predictions,
      });
    } else {
      this.setState({
        t9Candidates: [],
      });
    }
  },
  cancel() {
    this.safeSendFnKey('CANCEL');
  },
  deleteAll() {
    this.setState({
      inputBuffer: "",
      candidates: [],
      recentInput: "",
      t9Candidates: [],
    });
    this.safeClearInput();
  },
  enter() {
    this.safeSendFnKey('ENTER');
  },
  commitText(text) {
    this.safeInputText(text);
  },
  commitTextBuffer() {
    try {
      this.safeInputBuffer(this.state.inputBuffer, 0x757575, 0x757575);
    } catch (e) {
      console.log("Ошибка при фиксации буфера:", e);
    }
  },
  onDestroy() {
    console.log("⚡ Виджет - В С Е");
  },
});
