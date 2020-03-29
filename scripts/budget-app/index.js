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

  var deleteItem = function(type, id) {
    data.allItems[type].splice(
      data.allItems[type].findIndex(element => element.id === id),
      1
    );
  };

  var updateValues = function(type, innerType, id, val) {
    data.allItems[type][
      data.allItems[type].findIndex(element => element.id === id)
    ][innerType] = val;
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
    calculateTotal: calculateTotal,
    data: data,
    deleteItem: deleteItem,
    updateValues: updateValues
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

  var clearTable = function() {
    document
      .getElementById(DOMStrings.incomeTable)
      .tBodies.namedItem(DOMStrings.incomeBody).innerHTML = "";
    document
      .getElementById(DOMStrings.expenseTable)
      .tBodies.namedItem(DOMStrings.expenseBody).innerHTML = "";
  };

  var updateTable = function() {
    document
      .getElementById(DOMStrings.incomeTable)
      .tBodies.namedItem(
        DOMStrings.incomeBody
      ).innerHTML = budgetController.data.allItems.income
      .map(
        inc => `<tr id=${inc.id}>
          <td id="income-desc-${inc.id}" class="desc-edit">${
          inc.description
        }</td>
          <td id="income-val-${inc.id}" class="val-edit">${inc.value}</td>
          <td><i id="income-del-${inc.id}" class="fas fa-trash-alt"></i></td>
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
        exp => `<tr id=${exp.id}>
          <td>${exp.description}</td>
          <td>${exp.value}</td>
          <td><i id="expense-del-${exp.id}" class="fas fa-trash-alt"></i></td>
        </tr>`
      )
      .toString()
      .replace(/,/g, "");
  };

  return {
    DOMStrings: DOMStrings,
    updateTable: updateTable,
    clearTable: clearTable
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
    document
      .querySelector("#" + DOMStrings.incomeTable)
      .addEventListener("click", updateDeleteHandler);
    document
      .querySelector("#" + DOMStrings.incomeTable)
      .addEventListener("focusout", updateTable);
    document
      .querySelector("#" + DOMStrings.expenseTable)
      .addEventListener("click", updateDeleteHandler);
  };

  var updateTable = function(event) {
    if (event.target.tagName === "INPUT") {
      let type = event.target.id.toString().split("-")[1];
      let innerType = event.target.id.toString().split("-")[2];
      let id = parseInt(event.target.id.toString().split("-")[3]);
      let value = event.target.value;
      budgetController.updateValues(type, innerType, id, value);
      updateBudget(type);
      document.getElementById(type + "-" + innerType + "-" + id).innerHTML =
        event.target.value;
    }
  };

  var editHandler = function(event) {
    let id = event.target.id;
    let value = event.target.innerHTML;
    document.querySelector(
      "#" + id
    ).innerHTML = `<input type="text" value=${value} id="input-${id}" class="edit-input"/>`;
  };

  var updateDeleteHandler = function(event) {
    let type = event.target.id.toString().split("-")[0];
    let innerType = event.target.id.toString().split("-")[1];
    let id = parseInt(event.target.id.toString().split("-")[2]);

    if (innerType === "del") deleteItemHandler(type, id);
    else if (innerType === "desc" || innerType === "val") editHandler(event);
  };

  var deleteItemHandler = function(type, id) {
    budgetController.deleteItem(type, id);
    UIController.updateTable();
    updateBudget(type);
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
