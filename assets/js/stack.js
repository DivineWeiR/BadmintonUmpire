export default class Stack{
    constructor(){
        this.items = [];
    }
    push(element){
        this.items.push(element);
    }

    pop(){
        return this.items.pop();
    }

    top(){
        return this.items[this.items.length-1];
    }

    isEmpty(){
        return this.items.length==0;
    }
    size(){
        return this.items.length;
    }

    clear(){
        return this.items = [];
    }
}