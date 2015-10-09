var kana, flatKana;
var currentKana;

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
  populateKana('hiragana', $('#hiragana'));
  populateKana('katakana', $('#katakana'));
}

$(document).ready(function () {
  $('#input').focus();
  $('#input').keypress(function(e) {
    if(e.which == 13) {
      var cssClass = checkInput($('#input').val()) ? 'right' : 'wrong';
      $('#results').append('<span class="'+cssClass+'">' + currentKana.katakana + '<span>');
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

function populateKana(type, element) {
  for(var i = 0; i < kana.length; i++) {
    col = '<div class="kana-col">';
    for(var j = 0; j < kana[i].length; j++) {
      col += ('<div class="kana">' + kana[i][j][type] + '</div>');
    }
    col += '</div>';
    console.log(col);
    element.append(col);
  }
}
