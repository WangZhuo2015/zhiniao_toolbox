document.addEventListener('DOMContentLoaded', function() {
  const dataDiv = document.getElementById('dataDiv');
  chrome.storage.local.get(['question_dic'], function(result) {
      if(chrome.runtime.lastError) {
          dataDiv.innerText = 'An error occurred: ' + chrome.runtime.lastError.message;
      } else {
          dataDiv.innerText = JSON.stringify(result.question_dic, null, 2);
      }
  });

  document.getElementById('changeSpeed').onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: 'document.querySelector("#course-video_html5_api").playbackRate=16.0' });
    });
  };

  document.getElementById('inputFile').addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
  
    reader.onload = function(event) {
        var jsonObject = JSON.parse(event.target.result);
        chrome.storage.local.set({question_dic: jsonObject}, function() {
            console.log('Question data is updated with new JSON file.');
        });
    };
  
    reader.onerror = function() {
        console.log('An error occurred while reading the JSON file.');
    };
  
    reader.readAsText(file);
  });
  
});