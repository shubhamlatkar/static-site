var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(inc => (sum += inc.value));
    data.totals[type] = sum;
    data.totals.budget = data.totals.income - data.totals.expense;
    data.totals.percent =
      data.totals.income > 0
        ? Math.round((data.totals.expense / data.totals.income) * 100)
        : -1;
  };
  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0,
      budget: 0,
      percent: -1
    }
  };

  return {
    addItem: function(type, desc, val) {
      var newItem, id;
      id =
        data.allItems[type].length === 0
          ? 0
          : data.allItems[type][data.allItems[type].length - 1].id + 1;

      newItem =
        type === "expense"
          ? new Expense(id, desc, val)
          : new Income(id, desc, val);

      data.allItems[type].push(newItem);
    },
    calculateTotal: function(type) {
      calculateTotal(type);
    },
    data: data
  };
})();

var UIController = (function(budgetController) {
  var DOMStrings = {
    form: "#input-form",
    name: ".name",
    enteredValue: ".val",
    incomeBody: "display-income-body",
    expenseBody: "display-expense-body",
    incomeTable: "display-income-table",
    expenseTable: "display-expense-table",
    budget: "avail-balance",
    incomeLabel: "main-income-val",
    expenseLabel: "main-expenses-val",
    perLabel: "main-expenses-per"
  };

  return {
    DOMStrings: DOMStrings,
    updateTable: function() {
      document
        .getElementById(DOMStrings.incomeTable)
        .tBodies.namedItem(
          DOMStrings.incomeBody
        ).innerHTML = budgetController.data.allItems.income
        .map(
          inc => `<tr>
            <td>${inc.description}</td>
            <td>${inc.value}</td>
            <td>${inc.id}</td>
          </tr>`
        )
        .toString()
        .replace(/,/g, "");
      document
        .getElementById(DOMStrings.expenseTable)
        .tBodies.namedItem(
          DOMStrings.expenseBody
        ).innerHTML = budgetController.data.allItems.expense
        .map(
          exp => `<tr>
            <td>${exp.description}</td>
            <td>${exp.value}</td>
            <td>${exp.id}</td>
            <td>${exp.id}</td>
          </tr>`
        )
        .toString()
        .replace(/,/g, "");
    }
  };
})(budgetController);

var controller = (function(budgetController, UIController) {
  var DOMStrings = UIController.DOMStrings;

  var setupEventListners = function() {
    document.querySelector(DOMStrings.name).focus();
    document
      .querySelector(DOMStrings.form)
      .addEventListener("submit", function(e) {
        e.preventDefault();
        onFormSubmitHandler(
          e.target[0].value,
          e.target[1].value,
          parseFloat(e.target[2].value)
        );
      });
  };

  var updateBudget = function(type) {
    budgetController.calculateTotal(type);
    document.getElementById(DOMStrings.budget).innerHTML =
      budgetController.data.totals.budget;
    document.getElementsByClassName(DOMStrings.incomeLabel)[0].innerHTML =
      budgetController.data.totals.income;
    document.getElementsByClassName(DOMStrings.expenseLabel)[0].innerHTML =
      budgetController.data.totals.expense;
    document.getElementsByClassName(DOMStrings.perLabel)[0].innerHTML =
      budgetController.data.totals.percent;
  };

  var onFormSubmitHandler = function(type, desc, val) {
    if (desc !== "" && val !== 0 && !isNaN(val)) {
      clearFields();
      budgetController.addItem(type, desc, val);
      UIController.updateTable();
      updateBudget(type);
    }
  };

  var clearFields = function() {
    let fields = document.querySelectorAll(
      DOMStrings.name + "," + DOMStrings.enteredValue
    );

    fields = Array.prototype.slice.call(fields);
    fields.forEach(ele => (ele.value = ""));

    fields[0].focus();
  };

  return {
    init: function() {
      console.log("App started");
      setupEventListners();
    }
  };
})(budgetController, UIController);

controller.init();
