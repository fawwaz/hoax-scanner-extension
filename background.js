console.log('TEREKSEKUSI')
var CONNECT_CONSTANT = 'checker_connection';

chrome.runtime.onConnect.addListener(function(port){
  if (port.name === CONNECT_CONSTANT) {
    port.onMessage.addListener(function(msg){
      $.ajax({
        type: 'POST',
        url: 'https://hoax-scanner.herokuapp.com/check',
        data: JSON.stringify({
          query: msg.text
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
          if (!response.error) {
            port.postMessage({
              dedupekey: msg.dedupekey,
              originalText: msg.text,
              result: response.result,
            });
          }
        },
        failure: function(response) {
          console.log('ERROR');
          console.log(response);
        }
      })    
    });
  }
})

var contextMenuItem = {
  'id': 'hoax-scanner-submit',
  'title': 'Report as hoax',
  'contexts': ['selection']
};

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClick.addListener(function(data){
  if (data.menuItemId === 'hoax-scanner-submit' && data.selectionText) {
    console.log(data);
    $.ajax({
      type: 'POST',
      url: 'https://hoax-scanner.herokuapp.com/submit',
      data: JSON.stringify({
        query: data.selectionText
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(response) {
        port.postMessage({
          result: 'SUCCESS',
        });
      },
      failure: function(response) {
        port.postMessage({
          result: 'FAILED',
        });
      }
    })
  }
});