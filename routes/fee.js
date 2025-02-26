const {getFees, createLevelFees} = require("../controllers/fee")
const {Router} =require('express')
const router = Router()

router.get('/', getFees)
router.post('/', createLevelFees)

module.exports = router;