const dataDiv = document.getElementById('dataDiv');
document.addEventListener('DOMContentLoaded', function () {
  const dataDiv = document.getElementById('dataDiv');
  chrome.storage.local.get(['question_dic'], function (result) {
    if (chrome.runtime.lastError) {
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

  document.getElementById('inputFile').addEventListener('change', function () {
    if (confirm('Are you sure you want to import new data?')) {
      var file = this.files[0];
      var reader = new FileReader();

      reader.onload = function (event) {
        var newQuestions = JSON.parse(event.target.result); // 这是从文件中读取的新问题

        // 先从 chrome.storage 获取当前的 question_dic
        chrome.storage.local.get(['question_dic'], function (result) {
          if (chrome.runtime.lastError) {
            console.log('An error occurred: ' + chrome.runtime.lastError.message);
          } else {
            var question_dic = result.question_dic; // 这是当前的问题字典

            // 合并新问题
            for (let question in newQuestions) {
              if (!(question in question_dic)) { // 如果 question_dic 中不存在这个问题
                question_dic[question] = newQuestions[question]; // 添加新问题
              }
            }

            // 将更新后的 question_dic 保存回 chrome.storage
            chrome.storage.local.set({ question_dic: question_dic }, function () {
              console.log('Question data is updated with new JSON file.');
              chrome.runtime.sendMessage({ message: 'question_dic_updated' });
              dataDiv.innerText = JSON.stringify(result.question_dic, null, 2);
            });
          }
        });
      };

      reader.onerror = function () {
        console.log('An error occurred while reading the JSON file.');
      };

      reader.readAsText(file);
    }
  });

  document.getElementById('exportJson').addEventListener('click', function () {
    // 从storage中获取question_dic数据
    chrome.storage.local.get(['question_dic'], function (result) {
      if (chrome.runtime.lastError) {
        console.log('An error occurred: ' + chrome.runtime.lastError.message);
      } else {
        // 创建一个包含question_dic数据的blob对象
        var dataStr = JSON.stringify(result.question_dic);
        var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        // 创建一个下载链接并点击它以下载文件
        var exportFileDefaultName = 'data.json';

        var linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
    });
  });

  document.getElementById('clearData').addEventListener('click', function () {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      // 清除storage中的question_dic数据
      chrome.storage.local.set({question_dic:{}}, function () {
        if (chrome.runtime.lastError) {
          console.log('An error occurred: ' + chrome.runtime.lastError.message);
        } else {
          chrome.runtime.sendMessage({ message: 'question_dic_updated' });
          console.log('Data cleared successfully.');
          dataDiv.innerText = JSON.stringify({}, null, 2);
        }
      });
    }
  });


});