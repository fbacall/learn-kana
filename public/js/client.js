var kana, flatKana;

var currentKana;

var activeKana = [];

var kanaCount = {
  'hiragana': 0,
  'katakana': 0
};

Array.prototype.shuffle = function(){
    var counter = this.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter--) | 0;

        // And swap the last element with it
        temp = this[counter];
        this[counter] = this[index];
        this[index] = temp;
    }
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
    updateActiveKana();
    $('.kana-col').click(function () {
        $(this).toggleClass('active');
        updateActiveKana();
    });
}

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
  element.html('');
  for(var i = 0; i < kana.length; i++) {
    col = '<div class="kana-col active" data-kana-group="'+i+'" data-kana-type="'+type+'">';
    for(var j = 0; j < kana[i].length; j++) {
      col += ('<div class="kana-tile"><div class="kana">' + kana[i][j][type] + '</div>' +
        kana[i][j]['romaji'][0] + '</div>');
      kanaCount[type]++;
    }
    col += '</div>';
    element.append(col);
  }
}

function updateActiveKana() {
    activeKana = [];
    kanaCount.hiragana = 0;
    kanaCount.katakana = 0;
    $('.kana-col.active').each(function () {
        var group = $(this).data('kana-group');
        var type = $(this).data('kana-type');
        for(var i = 0; i < kana[group].length; i++) {
            activeKana.push({ symbol: kana[group][i][type], romaji: kana[group][i].romaji });
            kanaCount[type]++;
        }
    });
    $('#hiragana-count').html(kanaCount.hiragana);
    $('#katakana-count').html(kanaCount.katakana);
}

$(document).ready(function () {
    $('#input').focus();


    $('#input').keypress(function(e) {
        if(e.which == 13) {
            var cssClass = checkInput($('#input').val()) ? 'right' : 'wrong';
            $('#results-tally').append('<span class="'+cssClass+'">' + currentKana.katakana + '<span>');
            $('#previous-kana').html('<div class="'+cssClass+'"><div class="kana">' + currentKana.katakana +
                "</div>" + currentKana.romaji[0] + '<div>');
            $(this).val('');
            setKana();
        }
    });

    $('.select-none').click(function () {
        $(this).siblings('.kana-container').find('.kana-col').removeClass('active');
        updateActiveKana();
    });

    $('.select-all').click(function () {
        $(this).siblings('.kana-container').find('.kana-col').addClass('active');
        updateActiveKana();
    });
});
