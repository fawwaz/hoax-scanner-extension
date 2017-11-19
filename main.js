var CONNECT_CONSTANT = 'checker_connection';

var port = chrome.runtime.connect({ name: CONNECT_CONSTANT });
port.onMessage.addListener(function(msg){
  var selected = $('[data-dedupekey="' + msg.dedupekey + '"]');
  selected.attr('data-hoax-scanned', 'true');
  console.log(msg);
  if (0.8 < msg.result) {
    var danger_icon = chrome.extension.getURL('img/danger.png');
    var icon = document.createElement('img');
    icon.src = danger_icon;
    icon['vertical-align'] = 'middle';
    selected.find('[id*=feed_subtitle]')[0].append(icon)
  }else if (0.5 < msg.result && msg.result <= 0.8) {
    var warn_icon = chrome.extension.getURL('img/warn.png');
    var icon = document.createElement('img');
    icon.src = warn_icon;
    icon['vertical-align'] = 'middle';
    selected.find('[id*=feed_subtitle]')[0].append(icon);
  }

});

function checkUserConent() {
  console.log('executed');
  // Please revisit, think how to not repeat checking facebook pages
  const feed = $('[id*="hyperfeed"]').filter(function(i, f){
    var scanned = $(f).attr('data-hoax-scanned');
    return !scanned;
  })
  .each(function(){
    var dedupekey = $(this).attr("data-dedupekey");
    var text = $(this).find('[class*="userContent"]').filter(function(i, c){
        return !c.className.includes('userContentWrapper');
      }).map(function(i, c) {
        return c.innerText;
      })[0];
    port.postMessage({ dedupekey: dedupekey, text: text });
  });
  // const innertexts = $('[class*="userContent"]').filter(function(i, c){
  //   return !c.className.includes('userContentWrapper');
  // }).map(function(i, c) {
  //   return c.innerText;
  // });
  // console.log(innertexts);
}


// checkUserConent();
setInterval(checkUserConent, 10000);