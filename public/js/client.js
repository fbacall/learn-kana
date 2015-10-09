var kana, flatKana;
var currentKana;
var kanaCount = {
  'hiragana': 0,
  'katakana': 0
};

$.ajax({
  dataType: "json",
  url: 'data/kana.json',
  success: initApp
});

function initApp(data) {
  kana = data;
  flatKana = kana.reduce(function(a, b) {
    return a.concat(b);
  }, []); // flatten
  console.log("Loaded!");
  setKana();
  populateKanaTable('hiragana', $('#hiragana'));
  populateKanaTable('katakana', $('#katakana'));
}

$(document).ready(function () {
  $('#input').focus();
  $('#input').keypress(function(e) {
    if(e.which == 13) {
      var cssClass = checkInput($('#input').val()) ? 'right' : 'wrong';
      $('#results').append('<span class="'+cssClass+'">' + currentKana.katakana + '<span>');
      $('#previous-kana').html('<div class="'+cssClass+'"><div class="kana">' + currentKana.katakana +
          "</div>" + currentKana.romaji[0] + '<div>');
      $(this).val('');
      setKana();
    }
  });
});

function checkInput(val) {
  for(var i = 0; i < currentKana.romaji.length; i++) {
    if(val.toLowerCase() === currentKana.romaji[i]) {
      return true;
    }
  }
  return false;
}

function setKana() {
  currentKana = flatKana[Math.floor(Math.random() * flatKana.length)];
  $('#current-kana').html(currentKana.katakana);
}

function populateKanaTable(type, element) {
  for(var i = 0; i < kana.length; i++) {
    col = '<div class="kana-col">';
    for(var j = 0; j < kana[i].length; j++) {
      col += ('<div class="kana-tile"><div class="kana">' + kana[i][j][type] + '</div>' +
        kana[i][j]['romaji'][0] + '</div>');
      kanaCount[type]++;
    }
    col += '</div>';
    console.log(col);
    element.append(col);
  }
  $('#'+type+'-count').html(kanaCount[type]);
}
