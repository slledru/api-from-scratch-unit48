var express = require('express')
var router = express.Router()
const {
  listSnacks,
  findSnack,
  createSnack,
  updateSnack,
  deleteSnack
} = require('../db/storage')

/* GET snack listing. */
router.get('/', function(req, res, next) {
  const snacks = listSnacks()
  res.status(200).send({ data: snacks })
})

router.get('/:id', function(req, res, next) {
  try {
    const snack = findSnack(req.params.id)
    res.status(200).send({ data: snack })
  } catch (err) {
    next(err)
  }
})

router.post('/', function(req, res, next) {
  try {
    const snack = createSnack(req.body.brand, req.body.name,
      req.body.price, req.body.calories)
    res.status(201).send({ data: snack })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', function(req, res, next) {
  try {
    const { brand, name, price, calories } = req.body
    const snack = updateSnack(req.params.id, brand, name, price, calories)
    res.status(200).send({ data: snack })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', function(req, res, next) {
  try {
    const snack = deleteSnack(req.params.id)
    res.status(200).send({ data: snack })
  } catch (err) {
    next(err)
  }
})

module.exports = router
