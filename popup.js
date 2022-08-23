// let changeSpeed = document.getElementById('changeSpeed');
document.getElementById('changeSpeed').onclick = function (element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: 'document.querySelector("#course-video_html5_api").playbackRate=16.0' });
  });
};