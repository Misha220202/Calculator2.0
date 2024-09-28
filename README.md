# Calculator2.0

# Overview
* This project implements a basic calculator using JavaScript, HTML, and CSS. It supports both unary and binary operations and handles display formatting efficiently to ensure accurate and readable results.

# Features
* Unary Operations:
** Negation (+/-): Changes the sign of the current number.
** Percentage (%): Calculates the percentage of the current number.
* Binary Operations:
** Addition (+)
** Subtraction (-)
** Multiplication (*)
** Division (/)
* User Interactions:
** Numeric Input: Numbers can be input and displayed up to 11 digits.
** Decimal Point: Allows for decimal number input.
** Delete: Deletes the last entered digit.
** Clear: Resets the calculator to its initial state.
** Equals: Computes the result of the current binary operation.
* Error Handling:
** Dividing by zero results in NaN (Not a Number).
** Automatically removes unnecessary trailing zeros from decimal numbers.
* Display Formatting:
** Large numbers are shown in scientific notation.
** Results are limited to a display of 11 characters for clarity.
  
# Code Breakdown
1. Main Elements
** Unary Operators: Defined as ['+/-', '%'].
** Binary Operators: Defined as ['+', '-', '*', '/'].
** Screen: Displays the current input or result.
2. Key Variables
** currentDigits[]: Stores the digits of the number being entered.
** currentOperators[]: Keeps track of operators entered.
** currentValue[]: Holds the numbers involved in the calculation.
** result: Stores the ongoing or final result of operations.
** readyToCalculate: Tracks whether the calculator is ready for the next calculation step.
3. Functions
** unaryCalculate(a, operator): Handles unary operations (+/-, %).
** binaryCalculate(a, operator, b): Handles binary operations (+, -, *, /).
** removeTrailingZero(numString): Removes unnecessary trailing zeros in decimal results.
** showResult(num): Formats the result for display, handling large numbers and scientific notation.
4. Event Handling
** The calculator listens for user clicks on its buttons and responds accordingly:
** Numeric buttons update the current value.
** Unary and binary operators perform calculations.
** The = button finalizes the result.
