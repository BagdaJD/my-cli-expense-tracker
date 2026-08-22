import { JsonExpenseRepository } from './repository/json-expense-repository.js'

const repository = new JsonExpenseRepository()
const expenses = await repository.findAll()
console.log(expenses)