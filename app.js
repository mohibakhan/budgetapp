/* IFFE - For module pattern - data encapsulation - budgetController.x not accessible//budgetController.add not accessible
To access do budgetController.publicTest(5) */

// BUDGET CONTROLLER
let budgetController = (function() {
  //Create class/function constructors for inocme and expense
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  //Add Item
  return {
    addItme: function(type, des, val) {
      let newItem, ID;

      //Create New id
      if(data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length-1].id + 1; // Get last item and its ID and add 1
      } else {
          ID = 0;
      }

    //Inc or exp type
      if(type === 'exp') {
          newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
          newItem = new Income(ID, des, val);
      }

      //Add to data
      data.allItems[type].push(newItem);

      //return newly added item
      return newItem;
    },
    testing: function() {
        console.log(data);
    }
  };
})();

// UI CONTROLLER
let UIController = (function() {
  //
  let DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl) {
  //
  let setupEventListeners = function() {
    let DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  let ctrlAddItem = function() {

    let input, newItem;
    // 1. GET INPUT
    input = UICtrl.getinput();

    //Add item to budget controller
    newItem = budgetCtrl.addItme(input.type, input.description, input.value);

};

  return {
    init: function() {
      console.log('App Started...');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

//Call initialization
controller.init();
