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
    addItem: function(type, des, val) {
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

    deleteItem: function(type, id) {
      let ids, index;
      // Use like foreach - but returns an array
      ids = data.allItems[type].map(function(current) {
          return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);  //Deletes at number 3 and only deletes 1 element
      }

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
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
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
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">' +
              '<div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">' + 
              '</i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">' + 
            '<div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">' + 
            '<i class="ion-ios-close-outline"></i></button></div></div></div>';
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

    displayBudget: function(obj) {

        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
        
        if (obj.percentage > 0 ) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }
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

    //Set up Event Handler
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  let updateBudget = function() {
      
    // Calculate budget
    budgetCtrl.calculateBudget();

    // return budget
    let budget = budgetCtrl.getBudget();

    // display budget on UI
    UICtrl.displayBudget(budget);

  }

  let ctrlAddItem = function() {

    let input, newItem;
    // 1. GET INPUT
    input = UICtrl.getinput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0 ) {

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
        //Add Item to UI
        UICtrl.addListItem(newItem, input.type);
    
        // Clear the fields
        UICtrl.clearFields();
    
        // Calculate and update budget
        updateBudget();

        //Add item to budget controller
    }
};

  let ctrlDeleteItem = function(event) {
      let itemID, splitID, type, ID;
      //console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if (itemID) {
        
        //inc-1, exp-0
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        // Delete Item from Data structure
        budgetCtrl.deleteItem(type, ID);

        // Delete Item from UI


        // Updtate and show new budget
        

      }

  };

  return {
    init: function() {
      console.log('App Started...');
      UICtrl.displayBudget({
        budget:0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
    });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

//Call initialization
controller.init();
