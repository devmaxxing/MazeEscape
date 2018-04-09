var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('lobby', { roomName: req.query.room });
});

router.post('/', function(req, res, next) {
  res.render('lobby', { roomName: req.body.roomName, map: req.body.selectedMap });
});

module.exports = router;
