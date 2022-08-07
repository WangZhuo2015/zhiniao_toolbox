console.log("content injected.!!!!!!!!!!!!!");
var body = document.getElementsByTagName('body')[0];
const config = { attrbutes: true, childList: true, subtree: true }

question_data = [];
question_dic = {};
text = ""
const callback = function (mutationList) {
    // 答案元素 
    title = document.evaluate('//*[@id="examWatermark"]/div[5]/div[1]/div/div/div[1]/div/div', document).iterateNext();
    answer = document.evaluate('//*[@id="examWatermark"]/div[5]/div[2]/span', document).iterateNext();

    question_title = document.evaluate('//*[@id="examWatermark"]/div[4]/div[1]/div/div/div[1]/div/div', document).iterateNext();
    //获取选项
    question_options = document.evaluate('//*[@id="examWatermark"]/div[4]/div[2]', document).iterateNext();
    //点击
    // question_options.childNodes[0].click()
    if (title == null && question_title == null){
        console.log('无效加载')
        return
    }
    else if (title == null && answer == null){
        if (question_title == null || question_title == ''){
            return
        }
        console.log('答题')
        answer_text = question_dic[question_title.textContent]
        if (answer_text != null){
            console.log(answer_text);
            answers = answer_text.split(' ')[1].split('、');
            for (answer in answers){
                option_array = "ABCDEFGH"
                index = option_array.indexOf(answer)
                if (index != -1){
                    question_options.childNodes[index].click();
                    console.log(answer)
                }
            }
        }else{
            console.log('本题答案不在数据库中')
        }
        //not found

    }
    else if (title && title.textContent != '') {
        console.log('加载题库')
        text += "\n" + title.textContent + "  " + answer.textContent;
        // data.push(title.textContent+"\n"+answer.textContent)
        // console.log(data)
        question_data.push({
            "title": title.textContent,
            "answer": answer.textContent
        })
        question_dic[title.textContent] = answer.textContent;
        console.log(text)
    }
}
const observer = new MutationObserver(callback);
observer.observe(body, config);

// question_title = document.evaluate('//*[@id="examWatermark"]/div[4]/div[1]/div/div/div[1]/div/div', document).iterateNext();
// //获取选项
// question_options = document.evaluate('//*[@id="examWatermark"]/div[4]/div[2]', document).iterateNext();
// //点击
// question_options.childNodes[0].click()

// options = document.evaluate('//*[@id="examWatermark"]/div[5]/div[3]', document).iterateNext();
// option1text = options.childNodes[0].textContent