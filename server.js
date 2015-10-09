var express = require('express');

var app = express();

app.use(express.static('public'));

// This route is needed otherwise express doesn't set the content-type to be utf-8 and the kana symbols get mangled
app.get('/data/kana.json',function(req, res) {
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  res.sendFile('/data/kana.json', {root: __dirname});
});

app.listen(3333);

