class CalcController {

    constructor(){
        //O underline serve para dizer q este atributo é private

        this._audio = new Audio('click.mp3'); // OBS: Essa classe Audio é uma classe da Web API ( Pesquisar Audio Web API para descobrir os métodos que podem ser utilizados)
        this._audioOnOff = false;
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
        this.initKeyboard();
    }

    //Método criado para funcionar o CTRL + V
    pasteFromClipboard(){
        //O método addEventListener anexa um manipulador de eventos a um elemento sem sobrescrever os manipuladores de eventos existentes. Ao usar o método addEventListener (), o JavaScript é separado da marcação HTML, para melhor legibilidade e permite adicionar ouvintes de eventos mesmo quando você não controla a marcação HTML.
        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            //Verifica se o texto colado é número para aparecer no display, se não for número aparece a mensagem NAN
            this.displayCalc = parseFloat(text);

        })
    }

    //Método criado para funcionar o CTRL + C
    copToClipboard(){
        //Criando elemento input na tela dinamicamente, para ser possível selecionar o conteúdo inserido. Por ser SVG não é tão simples só pegar no HTML
        let input = document.createElement('input');

        //Adicionando o valor digitado dentro do elemento input
        input.value = this.displayCalc;

        //Adicionando o elemento input dentro do body para ser possível visualizar
        document.body.appendChild(input);

        //Acessando o conteúdo do input, ou seja, o conteúdo já esta selecionado
        input.select();

        //Pegar a informação q esta selecionada no input e copiar no Sistema Operacional
        document.execCommand("Copy");

        //Para não aparecer na tela ao digitar Ctrl + C
        input.remove();
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

        this.pasteFromClipboard();

        //Utilizando API para áudio
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            })
        });

    }

    //Esse Método vai controlar o atributo para saber se o áudio está ligado ou desligado.
    toggleAudio(){
        //Verificando se o atributo é ao contrario dele mesmo. (Tenho q entender melhor, parece uma forma de if simplificado)
        this._audioOnOff = !this._audioOnOff;
    }

    //Método para tocar o som de fato
    playAudio(){
        //Vai verificar se pode tocar o áudio
        if(this._audioOnOff){
            
            //Forçcando o play para voltar do início.
            this._audio.currentTime = 0;

            this._audio.play();

        }
    }

    //Método para capturar eventos do teclado
    initKeyboard(){
        
        document.addEventListener('keyup', e => {
            
            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                    
                case 'Backspace':
                    this.clearEntry();
                    break;
                    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case '=':                    
                case 'Enter':
                    this.calc();
                    break;
                
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copToClipboard();
                    break;
    
                /*default:
                    this.setError();
                    break;
                */
            }
        });
    }

    addEventListenerAll(element, events, fn) {
        //O método split() divide uma string em um array de strings de acordo com algum separador
        events.split(' ').forEach(event => {
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
        
        try{
            //join = O método join() junta todos os elementos de um array (ou um array-like object) em uma string e retorna esta string.
            //eval = é uma função de propriedade do objeto global (window) . O argumento da função eval() é uma string. Se a string representa uma expressão, eval() avalia a expressão. Se o argumento representa uma ou mais declarações em JavaScript, eval() avalia as declarações.
            return eval(this._operation.join(""));
        } catch(e){
            setTimeout(() => {
                this.setError();
            }, 1);
        }

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

        this.playAudio();

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

        if(value.toString().length > 10) {
            this.setError();
            //Esse return serve para não sair do if, ou seja, não ir para o return abaixo.
            return false;
        }

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