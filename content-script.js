console.log("content injected.!!!!!!!!!!!!!");
var body = document.getElementsByTagName('body')[0];
const config = { attrbutes: true, childList: true, subtree: true }

question_data = [];
question_dic = {};
text = ""
const callback = function (mutationList) {
    hash = window.location.hash


    if (hash.startsWith('#/home/examDetail/')) {
        tags = document.evaluate('//*[@id="examWatermark"]', document).iterateNext();
        div_idx = -1;
        for (idx in tags.childNodes) {
            if (tags.childNodes[idx].textContent.endsWith('题') || tags.childNodes[idx].textContent.endsWith('交卷') ) {
                div_idx = Number(idx) + 1;
                break;
            }
        }
        title = tags.childNodes[div_idx].childNodes[0]
        answer = tags.childNodes[div_idx].childNodes[1]
        options = tags.childNodes[div_idx].childNodes[2]

        if (document.querySelector("#examWatermark > div:nth-child(1) > div > span") == null) {
            // 答案页
            if (title && title.textContent != '') {
                console.log('加载题库')
                text += "\n" + title.textContent + "  " + answer.textContent;
                // data.push(title.textContent+"\n"+answer.textContent)
                // console.log(data)

                // option_list = []
                // for (idx in options){
                //     option_list.push(options[idx].textContent)
                // }

                question_data.push({
                    "title": title.textContent,
                    "answer": answer.textContent,
                    "options": options.textContent
                })
                data = JSON.stringify(question_data)
                // alert(data)
                question_dic[title.textContent] = answer.textContent;
                chrome.storage.local.set({question_dic: question_dic}, function() {
                    console.log('Question data is stored in storage.');
                  });
                console.log(text)
            }
        } else {
            // 作答
            //获取题目
            question_title = title//document.evaluate('//*[@id="examWatermark"]/div[4]/div[1]/div/div/div[1]/div/div', document).iterateNext();
            //获取选项
            question_options = answer // document.evaluate('//*[@id="examWatermark"]/div[4]/div[2]', document).iterateNext();
            if (question_title == null || question_title == '') {
                return
            }
            console.log('答题')
            answer_text = question_dic[question_title.textContent]
            if (answer_text != null) {
                console.log(answer_text);
                answers = answer_text.split(' ')[1].split('、');
                for (idx in answers) {
                    option_array = "ABCDEFGH"
                    index = option_array.indexOf(answers[idx])
                    if (index != -1) {
                        question_options.childNodes[index].click();
                        console.log(answer)
                    }
                }
            } else {
                console.log('本题答案不在数据库中')
            }
        }

    } else if (hash.startsWith('#/home/courseDetail/')) {
        //视频页
        if (document.querySelector("#course-video_html5_api").playbackRate<16){
            document.querySelector("#course-video_html5_api").playbackRate=16.0
        }
    } else {
        return
    }

    // 答案元素
    //*[@id="examWatermark"]/div[7]/div[1]/div/div/div[1]/div/div
    //*[@id="examWatermark"]/div[6]/div[1]/div/div/div[1]/div/div


    //点击
    // question_options.childNodes[0].click()

}
const observer = new MutationObserver(callback);
observer.observe(body, config);


document.addEventListener("DOMContentLoaded",function(){
    // let js = 'injected.js'
    // let tmp = document.createElement('scripts');
    // tmp.src = chrome.extension.getURL(js);
    // tmp.setAttribute('type','text/javascript');
    // document.head.appendChild(tmp)
    //if window.location
    hash = window.location.hash;
    if (hash.startsWith('#/home/courseDetail/')){
        document.querySelector("#course-video_html5_api").playbackRate=16.0
    }
});