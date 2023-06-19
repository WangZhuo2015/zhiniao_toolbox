// let changeSpeed = document.getElementById('changeSpeed');
document.getElementById('changeSpeed').onclick = function (element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: 'document.querySelector("#course-video_html5_api").playbackRate=16.0' });
  });
};

document.addEventListener('DOMContentLoaded', function() {
  const dataDiv = document.getElementById('dataDiv');
  chrome.storage.local.get(['question_dic'], function(result) {
      if(chrome.runtime.lastError) {
          dataDiv.innerText = 'An error occurred: ' + chrome.runtime.lastError.message;
      } else {
          dataDiv.innerText = JSON.stringify(result.question_dic, null, 2);
      }
  });
});
