var emojiCounter = {};

document.addEventListener("DOMContentLoaded", function () {
  var emojis = document.querySelectorAll('div#source svg[id*="emoji_"]');
  emojis.forEach(function(emoji) {
      emoji.onclick = function() {
        var id = emoji.id;
        var count = emojiCounter[id];
        emojiCounter[id] = typeof(count) == "undefined" ? 1 : count + 1;
        document.querySelector('#' + id + ' + div.count').innerHTML = emojiCounter[id];
        updateTargetEmoji(emojiCounter);
      }
  });

  var target = document.querySelector('div#target');
  target.onclick = function() {
    while (target.firstChild) {
      target.removeChild(target.firstChild);
      emojiCounter = {};
      document.querySelectorAll('div.count').forEach(function(el) {el.innerHTML = 0;});
    }
  }
});

var updateTargetEmoji = function (emojiCounter) {
  var target = document.querySelector('div#target');
  var topList = getToplist(emojiCounter);

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "id", "emoji_build");
  svg.setAttributeNS(null, "enable-background", "new 0 0 128 128");
  svg.setAttributeNS(null, "viewBox", "0 0 128 128");

  var clonedParts = {
    face: [],
    mouth: [],
    eyes: [],
  }

  var partUsed = {};
  var partLocked = {};

  for (var i = 0; i < topList.length && i < 3; i++) {
    var id = topList[i][0];
    var emoji = document.querySelector('div#source svg#' + id);
    var parts = emoji.dataset.prio.split(" ");
    var canLock = true;

    for (var p = 0; p < parts.length; p++) {
      var part = parts[p];

      if (!partLocked[part]) {
        if (canLock) {
          partLocked[part] = true;
          canLock = false;
        }

        clonedParts[part] = [];

        var nodes = emoji.querySelectorAll('[data-part="' + part + '"]');
        [].forEach.call(nodes, function(node) {
          clonedParts[part].push(node.cloneNode(true));
        });
      }
    }
  }

  ['face', 'mouth', 'eyes'].forEach(function (part) {
    var parts = clonedParts[part];
    parts.forEach(function(node) {
      svg.appendChild(node);
    });
  });

  // Update target.
  while (target.firstChild) {
      target.removeChild(target.firstChild);
  }
  var serializer = new XMLSerializer();
  var xmlString = serializer.serializeToString(svg);
  target.appendChild(svg);
}

var getToplist = function (emojiCounter) {
  var sortable = [];
  for (var id in emojiCounter) {
    sortable.push([id, emojiCounter[id]]);
  }
  var sorted = sortable.sort(function(a, b) { return b[1] - a[1]; });
  return sorted;
}
