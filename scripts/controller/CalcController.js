class CalcController {
    constructor() {
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._boolEquals = false;
        this._currentEntry = '';
        this._lastEntry = 0;
        this._currentResult = 0;
        this._currentOperation;
        this._currentDate;
        this._calcOperations = {
            igual: '=',
            soma: '+',
            subtracao: '-',
            multiplicacao: '*',
            divisao: '/',
            porcento: '%'
        };
        this.initialize();
    }

    initialize() {
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.initButtonsEvents();
    }

    setDisplayError() {
        this.displayCalc = 'Error';
    }

    constructNewEntry(value) {
        if (this._boolEquals) {
            this.allClearManager();
        }
        if (this._currentEntry == '' && value == 'ponto') {
            this._currentEntry = '0';
        }
        if (value != 'ponto') {
            if (this._currentEntry == '0') {
                this._currentEntry = '';
            }
            this._currentEntry += value;
        } else if (this._currentEntry.indexOf('.') == -1) {
            this._currentEntry += '.';
        }
        this.displayCalc = this._currentEntry;
    }

    setLastEntry() {
        this._lastEntry = this._currentEntry;
        this._currentEntry = '';
    }

    displayOperation(equals = '') {
        if (equals == '') {
            console.log(`${this._currentResult}${(this._currentOperation == undefined) ? '' : this._currentOperation}${this._currentEntry}`);
        } else if (this._currentOperation == undefined) {
            console.log(`${this._lastEntry}${equals}`);
        } else {
            console.log(`${this._currentResult}${this._currentOperation}${this._lastEntry}${equals}`);
        }
    }

    executeOperation() {
        if (this._currentOperation != undefined) {
            let operation = `${this._currentResult}${this._currentOperation}${this._lastEntry}`;
            this._currentResult = eval(operation);
            this.displayCalc = this._currentResult;
        } else {
            this._currentResult = this._lastEntry;
        }
    }

    equalManager() {
        if (this._currentEntry != '') {
            this.setLastEntry();
        }
        this.displayOperation('=');
        this.executeOperation();
    }

    percentageManager() {
        if (this._currentOperation == undefined) {
            this._currentEntry = 0;
            this.displayCalc = 0;
        } else if (this._currentOperation == '+' || this._currentOperation == '-') {
            this._currentEntry *= this._currentResult / 100;
        } else {
            this._currentEntry = this._currentEntry / 100;
        }
        this._lastEntry = this.displayCalc = this._currentEntry;
        this.displayOperation('=');
    }

    managesOperation(operation) {
        if (this._currentEntry == '') {
            this._currentOperation = this._calcOperations[operation];
        } else {
            this.setLastEntry();
            this.executeOperation();
            this._currentOperation = this._calcOperations[operation];
        }
        this.displayOperation();
    }

    clearEntryManager() {
        if (this._currentEntry == '') {
            this._currentEntry = '';
            this.displayCalc = 0;
            this._currentResult = 0;
            this.setLastEntry();
        } else {
            this._currentEntry = 0;
            this.displayCalc = this._currentEntry;
        }
    }

    allClearManager() {
        this._currentEntry = '';
        this.displayCalc = 0;
        this._currentResult = 0;
        this.setLastEntry();
    }

    directButtonAction(buttonValue) {
        switch (buttonValue) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case 'ponto':
                this.constructNewEntry(buttonValue);
                this._boolEquals = false;
                break;

            case 'soma':
            case 'subtracao':
            case 'multiplicacao':
            case 'divisao':
                this.managesOperation(buttonValue);
                this._boolEquals = false;
                break;

            case 'igual':
                this.equalManager();
                this._boolEquals = true;
                break;

            case 'porcento':
                this.percentageManager();
                this._boolEquals = false;
                break;

            case 'ce':
                this.clearEntryManager();
                break;

            case 'ac':
                this.allClearManager();
                break;

            default:
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');
        buttons.forEach((button, index) => {
            this.addEventListenerAll(button, 'click drag', e => {
                const buttonValue = button.className.baseVal.replace('btn-', '');
                this.directButtonAction(buttonValue);
            });
            this.addEventListenerAll(button, 'mouseover mouseup mousedown', e => {
                button.style.cursor = 'pointer';
            });
        });
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}