class CalcController {

    constructor(){
        //O underline serve para dizer q este atributo é private

        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    //Método principal do projeto ( Tudo o que acontecer na calculadora vai vir desse método)
    initialize(){

        //setDisplayDateTime é um método.
        this.setDisplayDateTime();

        /*let interval = */setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);
        
        //setLastNumberToDisplay para quando iniciar a calculadora aparecer o número 0
        this.setLastNumberToDisplay();

    }

    addEventListenerAll(element, events, fn) {
        //O método split() divide uma string em um array de strings de acordo com algum separador
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        })

    }

    clearAll(){
        this._operation = [];

        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult(){
        
        //join = O método join() junta todos os elementos de um array (ou um array-like object) em uma string e retorna esta string.
        return eval(this._operation.join(""));

    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {

            //pop serve para retira o último elemento e quarda na variável (no caso é a last)
            last = this._operation.pop();
            
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {
            
            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        //Lógica para o calculo de porcentagem
        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {
            //criando array para trocar o valor de _operation
            this._operation = [result];

            //push = O método push() adiciona um ou mais elementos ao final de um array e retorna o novo comprimento desse array.
            if (last) this._operation.push(last);

        }

        //console.log(this._operation);
        this.setLastNumberToDisplay();
        //this.isOperator();
    }

    getLastItem(isOperator = true){
        
        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){

            //O ponto de exclamação (! = not) significa negação, ou seja, se não for um operador o número foi achado.
            if (this.isOperator(this._operation[i]) == isOperator) {

                lastItem = this._operation[i];
                break;
            }
            
        }

        if (!lastItem) {

            //(?) Ponto de interrogação = Se for igual a true... (:) Dois pontos = Se não
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;


    }

    setLastNumberToDisplay(){

        //Pegar o último número
        let lastNumber = this.getLastItem(false);
        
        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
        
    }

    addOperation(value){

        //console.log('Teste', value, isNaN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())){
            //Se for String vai cair Aqui 

            if(this.isOperator(value)){
                //Aqui troca o operador
                this.setLastOperation(value);

            } else {

                this.pushOperation(value);
                
                //atualiza display
                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                //Se for Number vai cair Aqui 
                let newValue = this.getLastOperation().toString() + value.toString();
                /*parseInt converte Uma string por número.
                this.setLastOperation(parseInt(newValue));*/

                /*parseFloat analisa um argumento string, e retorna um numero de ponto flutuante. Se ele encontrar um carácter diferente de um sinal (+ ou -), numeral (0-9), um ponto decimal, ou um expoente, ele retorna o valor até esse ponto e ignora esse caractere e todos os caracteres seguintes. Espaços a direita e a esquerda são permitidos.
                this.setLastOperation(parseFloat(newValue));*/

                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();

            }
        }

    }

    setError(){
        this.displayCalc = "Error";
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        //Pipe Pipe (||) significa or, ou em inglês.
        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
                break;
                
            case 'ce':
                this.clearEntry();
                break;
                
            case 'soma':
                this.addOperation('+');
                break;
                
            case 'subtracao':
                this.addOperation('-');
                break;
                
            case 'multiplicacao':
                this.addOperation('*');
                break;
                
            case 'divisao':
                this.addOperation('/');
                break;
                
            case 'porcento':
                this.addOperation('%');
                break;
                
            case 'igual':
                this.calc();
                break;
            
            case 'ponto':
                this.addDot('.');
                break;

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
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        
        /*buttons.addEventListener("click", e => {
            console.log(e);
        });*/

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, "click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";

            })
        });
    };

    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"

        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    };


    //Get pega o valor inserido
    get displayCalc(){

        return this._displayCalcEl.innerHTML;

    }
    
    //Set altera o valor q esta inserido
    set displayCalc(value) {

        return this._displayCalcEl.innerHTML = value;
        
    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        return this._dateEl.innerHTML = value;

    }

    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
}