const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const httpErrors = require('http-errors')
const dbFile = path.join(__dirname, 'store.json')

let snacks = []

function loadSnacks() {
  fs.readFile(dbFile, 'utf8', (err, data) => {
    if (err) {
      saveSnacks()
    } else {
      try {
        snacks = JSON.parse(data)['snacks']
      } catch (ex) {
        saveSnacks()
      }
    }
  })
}

function saveSnacks() {
  const stored = { snacks: snacks }
  fs.writeFile(dbFile, JSON.stringify(stored), 'utf8', (err) => {
    if (err) {
      throw httpErrors(500, 'Unable to save the snacks')
    }
  })
}

function listSnacks() {
  return snacks
}

function findSnack(id) {
  if (id) {
    const found = snacks.filter((snack) => snack.id === id)
    if (found.length === 1) {
      return found[0]
    }
    if (found.length > 1) {
      throw httpErrors(400, 'Invalid Id: Snack Id is not unique')
    }
    throw httpErrors(404, 'Invalid Id: Snack does not exist')
  }
  throw httpErrors(400, 'Required field missing')
}

function createSnack(brand, name, price, calories) {
  if (brand && name && price && calories) {
    const snack = { id: uuid(), brand, name, price, calories }
    snacks.push(snack)
    saveSnacks()
    return snack
  }
  throw httpErrors(400, 'Required field missing')
}

function updateSnack(id, brand, name, price, calories) {
  const snack = findSnack(id)
  if (brand && name && price && calories) {
    snack.brand = brand
    snack.name = name
    snack.price = price
    snack.calories = calories
    saveSnacks()
    return snack
  }
  throw httpErrors(400, 'Required field missing')
}

function deleteSnack(id) {
  const snack = findSnack(id)
  const index = snacks.indexOf(snack)
  if (index >= 0) {
    snacks.splice(index, 1)
    saveSnacks()
    return snack
  }
  throw httpErrors(404, 'Invalid Id: Snack does not exist')
}

module.exports = {
  loadSnacks,
  listSnacks,
  findSnack,
  createSnack,
  updateSnack,
  deleteSnack
}
