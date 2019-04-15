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

  let calculateTotal = function(type) {
    let sum = 0;

    data.allItems[type].forEach(function(cur) {
        sum += cur.value;
    });

    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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

    calculateBudget: function() {

        // Calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        // Calculate budget: inc - exp
        data.budget = data.totals.inc - data.totals.exp;

        // Calculate %age of spent income
        if(data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
        
    },

    getBudget: function() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }
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
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
      };
    },

    addListItem: function(obj, type) {

        let html, newHtml, element;

        // Create HTML with placeholder
        if (type === 'inc') {
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
      
      // Replace placeholder with actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        // Insert HTML into DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
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

  let updateBudget = function() {
      
    // Calculate budget
    budgetCtrl.calculateBudget();

    // return budget
    let budget = budgetCtrl.getBudget();

    // display budget on UI
    console.log(budget);

  }

  let ctrlAddItem = function() {

    let input, newItem;
    // 1. GET INPUT
    input = UICtrl.getinput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0 ) {

        newItem = budgetCtrl.addItme(input.type, input.description, input.value);
    
        //Add Item to UI
        UICtrl.addListItem(newItem, input.type);
    
        // Clear the fields
        UICtrl.clearFields();
    
        // Calculate and update budget
        updateBudget();

        //Add item to budget controller
    }
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
