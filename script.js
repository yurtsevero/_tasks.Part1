"use strict";

// extract the numbers and operands from the given term
const extractNumsOps = (term) => {
  //use the split method to create a array of chars with the charachters that are in term
  const chars = term.split("");
  //create numbers , operands arrays and a number variable
  let numbers = [];
  let operands = [];
  let number = "";

  //loop through the chars and find out wheter if the char is a number or an operand
  for (const char of chars) {
    //if char assign/add it to a number variable
    if (char.match(/\d{1,9}/)) {
      number += char;
    }
    //if operand add it to the operands array and also add the number to the numbers array since operand means the end of the number
    if (isOperand(char)) {
      operands.push(char);
      numbers.push(number);
      number = "";
    }
  }
  //for the last number after the last operand do the add numbers array operation
  numbers.push(number);

  //return the numbers and operands
  return [numbers, operands];
};

//calculator function accepts number and operand arrays and returns the calculated value
const calculator = (nums, operands) => {
  //helper object to sort the given operands in the right order based on the school rules, each operand gets a value 1 is the highest 4 is the lowest "point"
  const operandObj = {
    "*": 1,
    "/": 2,
    "+": 3,
    "-": 4,
  };

  //manipulating the  operands array adding one charechter for index info
  const operandsWithIdx = operands.map((operand, idx) => {
    return (operand += idx);
  });
  //copy of operands array with index information
  let sortedOperands = [...operandsWithIdx];
  //sort the operands array to perform the calculations in the correct order
  sortedOperands = sortedOperands.sort((op1, op2) => {
    return operandObj[op1[0]] - operandObj[op2[0]];
  });
  //loop through the operands array to perform the calculations
  operandsWithIdx.forEach((operandwithidx) => {
    const operand = operandwithidx[0];
    const indexOperand = Number(operandwithidx[1]);

    nums[indexOperand + 1] = calcMethod(
      nums[indexOperand],
      nums[indexOperand + 1],
      operand
    );
  });
  //return the result
  return nums[nums.length - 1];
};

//calculation method to perform the calculations between given two numbers in string form
const calcMethod = (num1, num2, operand) => {
  num1 = Number(num1);
  num2 = Number(num2);

  if (operand === "*") return num1 * num2;
  if (operand === "/") return num1 / num2;
  if (operand === "+") return num1 + num2;
  if (operand === "-") return num1 - num2;
};

//function to check whether a given char is an operand or not
const isOperand = (char) => {
  if (char === "*" || char === "/" || char === "+" || char === "-") return true;
  return false;
};

// main function for calculation
const termCalculator = (term) => {
  //get the first index of the open paranthesis
  const indexOfOpenParanthesis = term.lastIndexOf("(");
  //get the first index of the close paranthesis
  const indexOfCloseParanthesis = term.lastIndexOf(")");

  //in case of no open paranthesis the calculation can start without further work
  if (indexOfOpenParanthesis === -1) {
    //call the extractNumsOps function to extract the numbers and operands
    const [numbers, operands] = extractNumsOps(term);
    //return the returned value from the calculator function
    return calculator(numbers, operands);
  }
  //if paranthesis exists then to parse the term into sections
  else {
    const termBeforeParanthesis = term.substring(0, indexOfOpenParanthesis);

    const termInParanthesis = term.substring(
      indexOfOpenParanthesis + 1,
      indexOfCloseParanthesis
    );
    //call the extractNumsOps function to extract the numbers and operands
    let [numbers, operands] = extractNumsOps(termInParanthesis);

    const termAfterParanthesis = term.substring(indexOfCloseParanthesis + 1);
    const subTerm =
      termBeforeParanthesis +
      String(calculator(numbers, operands)) +
      termAfterParanthesis;

    //call the extractNumsOps function to extract the numbers and operands
    [numbers, operands] = extractNumsOps(subTerm);
    //return the returned value from the calculator function
    return calculator(numbers, operands);
  }
};

// test data

console.log(termCalculator("(5 + 8) * 3/8 +3"));
console.log(termCalculator("((1+1)+5 + 8) * 2 +3"));
console.log(termCalculator("((1+1)+5 + 8) * 9 / 3"));
