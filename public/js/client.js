var kana, flatKana;

var currentKanaIndex = -1;
var activeKana = [];

var answers = {
  correct: 0,
  incorrect: 0
};

var kanaCount = {
  hiragana: 0,
  katakana: 0
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
  populateKanaTable('hiragana', $('#hiragana'));
  populateKanaTable('katakana', $('#katakana'));
  updateActiveKana();

  $('.kana-col').click(function () {
    $(this).toggleClass('active');
    updateActiveKana();
  });
}

function checkInput(val) {
  for(var i = 0; i < activeKana[currentKanaIndex].romaji.length; i++) {
    if(val.toLowerCase() === activeKana[currentKanaIndex].romaji[i]) {
      return true;
    }
  }
  return false;
}

function nextKana() {
  $('#progress').html('' + (answers.correct + answers.incorrect) + ' / ' + activeKana.length);
  if(++currentKanaIndex >= activeKana.length)
    endQuiz();
  else
    $('#current-kana').html(activeKana[currentKanaIndex].symbol);
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
  currentKanaIndex = -1;
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

function startQuiz() {
  updateActiveKana();
  activeKana.shuffle();
  answers.correct = 0;
  answers.incorrect = 0;
  $('#select-kana').hide();
  $('#previous-kana').html('');
  $('#quiz').show();
  nextKana();
}

function endQuiz() {
  $('#score').html('Score: ' + answers.correct + ' / ' + activeKana.length);
  $('#results').show();
  $('#quiz').hide();
}

function resetQuiz() {
  $('#results').hide();
  $('#select-kana').show();
}

$(document).ready(function () {
  $('#input').focus();


  $('#input').keypress(function(e) {
    if(e.which == 13) {
      var input = $('#input').val();
      var answer = checkInput(input);
      answers[answer ? 'correct' : 'incorrect']++;
      var cssClass = answer ? 'right' : 'wrong';
      var kanaEl = '<div class="'+cssClass+'"><div class="kana">' + activeKana[currentKanaIndex].symbol +
          "</div>" + activeKana[currentKanaIndex].romaji[0] + '<div>';
      $('#results-tally').append(kanaEl);
      $('#previous-kana').html(kanaEl);
      if(!answer)
        $('#previous-kana').append("<del>"+input+"</del>");
      $(this).val('');
      nextKana();
    }
  });

  $('#start-quiz').click(startQuiz);
  $('#end-quiz').click(endQuiz);
  $('#reset-quiz').click(resetQuiz);

  $('.select-none').click(function () {
    $(this).closest('.tab-pane').find('.kana-col').removeClass('active');
    updateActiveKana();
  });

  $('.select-all').click(function () {
    $(this).closest('.tab-pane').find('.kana-col').addClass('active');
    updateActiveKana();
  });
});
