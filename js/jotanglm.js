let text = document.querySelector(".文字栏");
let button = document.querySelector(".按钮");
let pzx = document.querySelector(".pzx");
let add = document.querySelector(".add");
let newx = document.querySelector(".new");
let newadd = document.querySelector(".newsbutton");
let operationPanel = document.querySelector(".操作面板");
let apply = document.querySelector("#apply");
let input = text.value.trim();


window.onload = function () {//页面加载时
    loadcolor();//加载已保存的颜色
    renderSessions();  //渲染会话列表(我真的是现在动不动就渲染(被报错整麻木了))
};


function color() {
    var colorchooser = document.querySelector("#colorchooser");//获取第一个id为colorchooser的元素
    var themecolor = colorchooser.value;//themecolor就是颜色选择器的值(颜色)

    operationPanel.style.backgroundColor = themecolor;//设置操作面板的背景颜色
    localStorage.setItem('savedcolor', themecolor);//把themecolor储存到localStorage里面
}


function loadcolor() {
    var usedcolor = localStorage.getItem('savedcolor');//把储存的localStorage整出来
    colorchooser.value = usedcolor;
    if (usedcolor) {
        operationPanel.style.backgroundColor = usedcolor;
    }
}


function scroll(n) {
    n.scrollTop = n.scrollHeight;//滚动条垂直位置=总高度，即滚动至底部
}


function createSession(name) {
    return {
        id: Date.now().toString(), // 使用时间戳作为唯一id
        name: name,
        content: [] // 会话内容为空数组  
    };
}


function loadSessions() {
    const sessionsJson = localStorage.getItem('sessions');//从localStorage中找到键名为sessions的项(哇,好高级的样子)->找到储存的sessions数组
    return sessionsJson ? JSON.parse(sessionsJson) : [];
    //如果有这样的项，把它转化为josn文件并打印出来，如果没有，输出空数组
}//因为localStorage只接受字符串类型的数据,而我们浏览器更喜欢json


function saveSessions(sessions) {
    localStorage.setItem('sessions', JSON.stringify(sessions));//把sessions中的内容储存到localStorage中，键名为sessions
}


let sessions = loadSessions();
let currentSessionId = null; // 当前会话id为null,初始化


/*别问我下面两个有的地方注释为毛一模一样,问就是开始上面没有加那些东西,然后就苦逼的报错了,1h的debug(已卒)*/
function switchSession(sessionId) {
    const currentSession = sessions.find(session => session.id === sessionId);//在sessions数组里面找到id为sessionId的session，把它叫做currentSession
    if (currentSession) {//如果找到了这样的session
        currentSessionId = sessionId;
        const meetingList = document.querySelector('.会话');//获取第一个class为'会话'的元素
        meetingList.innerHTML = '';//清空会话列表中的内容
        sessions.forEach(session => {//遍历sessions数组

            const li = document.createElement('li');//为每一个会话名添加一个li
            li.textContent = session.name;//li的文本内容为会话名
            li.dataset.sessionId = session.id;//li所指向的会话id为session.id

            const deleteButton = document.createElement('button');//为每一个会话创建一个button,dom名是deleteButton

            deleteButton.textContent = '🗑️'; //deletebutton的文本内容是🗑️
            deleteButton.dataset.sessionId = session.id; // deleteButton所指向的会话id就是session.id  
            deleteButton.className = 'delete-button'; // 给delete添加一个class  


            li.appendChild(deleteButton); // 将deleteButton添加到会话项中

            li.addEventListener('click', () => switchSession(session.id));//为每一个li添加事件检测器，点击时执行切换会话函数，所切换的会话id为session.id
            deleteButton.addEventListener('click', () => deleteSession(session.id));//给deleteButton添加事件侦测器,click时执行deleteSession函数
            if (session.id === currentSessionId) {
                li.classList.add('now-session');
            } else {
                li.classList.remove('now-session');
            }
            meetingList.appendChild(li);//把li全部添加回会话列表
        });

        const chat = document.querySelector('.chat');//获取第一个class为chat的元素
        chat.innerHTML = '';//清空chat里的内容
        currentSession.content.forEach(message => {//遍历current.content数组,嘿嘿好用
            const li = document.createElement('li');//为每一条历史消息创建一个li
            li.textContent = message;//li的内容为message
            chat.appendChild(li);//再将所有的li添加回去
        });
        scroll(chat.parentElement); // 滚动到最新消息  
    }
}

/*不加这个函数发现页面不会动态更新,特别是在读取localStorage时,找了一个半小时左右,了解了渲染这个抽象东西,虽然还是不懂,但至少能用了*/
function renderSessions() {//渲染会话
    const meetingList = document.querySelector('.会话');//获取第一个class为'会话'的元素
    meetingList.innerHTML = '';//清空会话列表
    sessions.forEach(session => {//又是遍历(真好用)

        /*一样的*/
        const li = document.createElement('li');
        li.textContent = session.name;
        li.dataset.sessionId = session.id;

        const deleteButton = document.createElement('button');//为每一个会话创建一个button,dom名是deleteButton

        deleteButton.textContent = '🗑️'; //deletebutton的文本内容是🗑️
        deleteButton.dataset.sessionId = session.id; // deleteButton所指向的会话id就是session.id  
        deleteButton.className = 'delete-button'; // 给delete添加一个class  


        li.appendChild(deleteButton); // 将deleteButton添加到会话项中
        li.addEventListener('click', () => switchSession(session.id));

        deleteButton.addEventListener('click', () => deleteSession(session.id));//给deleteButton添加事件侦测器,click时执行deleteSession函数
        meetingList.appendChild(li);
    });
}


function deleteSession(sessionId) //定义deleteSession函数
{
    const sessionIndex = sessions.findIndex(session => session.id === sessionId);
    if (sessionIndex !== -1) {
        sessions.splice(sessionIndex, 1); // 从会话列表中移除会话  
        saveSessions(sessions); // 保存更新后的会话列表  
        renderSessions(); // 重新渲染(高级词汇)会话列表  


        // 如果当前会话是被删除的会话，则切换到其他会话(发现删除会话后在输入框不能继续对话,就加了这行代码,只debug了0.25个小时,我真是个小天才) 
        if (currentSessionId === sessionId) {
            switchSession(sessions[0].id); // 切换到第一个会话  
        }
    }
}


function renderChatHistory(history) {//渲染聊天栏
    const chat = document.querySelector('.chat');//获取第一个class为chat的元素
    chat.innerHTML = '';//一样的


    history.forEach(message => {//爽了,还是遍历
        const li = document.createElement('li');
        li.textContent = message;
        chat.appendChild(li);
    });
    scroll(chat.parentElement); // 滚动到最新消息  
}


function chati() {
    let input = text.value.trim();
    if (input === "") {
        alert("请输入点什么!");
        return;
    }

    const currentSession = sessions.find(session => session.id === currentSessionId);
    if (currentSession) {
        let inid = Date.now();//时间戳！
        var chating = document.createElement("li");


        chating.id = "in_" + inid;
        chating.style.color = "red";
        chating.textContent = "USER：" + input;


        const chat = document.querySelector('.chat');
        chat.appendChild(chating);
        currentSession.content.push("USER：" + input);
        //把"USER：" + input添加到currentSession.content数组


        let anid = Date.now();//时间戳真好用
        var answer = document.createElement("li");


        answer.id = "an_" + anid;//an_时间戳=唯一id


        answer.style.color = "blue";
        answer.textContent = "JoTangLM:";//css样式设计


        chat.append(answer);
        currentSession.content.push("JoTangLM:"); // 占位符  

        const requestBody = JSON.stringify({//把js对象转化为json
            "messages": [
                { "role": "user", "content": input }//千帆api文档给出的输入
            ]
        });


        fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=[24.005711c55c17e296a17ab87895a33c98.2592000.1732013880.282335-115931407]', {
            method: 'POST',//请求方式是post
            headers: {
                'Content-Type': 'application/json'//这玩意只接受json(已卒)
            },
            body: requestBody
        })


            .then(response => response.json())//响应(千帆的回复)转换为json
            .then(data => {
                let botResponse = data.result.toString();
                show(answer, botResponse);
                currentSession.content[currentSession.content.length - 1] = "JoTangLM: " + botResponse;
                // 更新占位符(一定要加botResponse,开始没加导致只储存了"JoTangLM:",又1h的的debug(再卒))
                saveSessions(sessions);
            })
            .catch(error => {
                let botResponse = '啊哦,好像出现了一些问题';
                show(answer, botResponse);
                currentSession.content[currentSession.content.length - 1] = "JoTangLM: " + botResponse; // 更新占位符  
                saveSessions(sessions);
            });

        scroll(chat.parentElement); // 滚动到最新消息  
    }

    text.value = "";
}


function show(x, y) {
    let i = 0;//初始化循环值
    let show = setInterval(function () {
        if (i <= y.length) {//如果i比y的字符串长度小(即还未输出完毕)
            x.textContent += y.charAt(i);//把y在i处的字符添加到x的文本中
            i++;//i自加
        }
        else {
            clearInterval(show);//如果输出完毕,则清除show的值
        }
        scroll(pzx);//滚动至底部
    }, 100)
}



function add1() {
    let name = newx.value.trim();
    if (name === "") {
        alert("名称不能为空！");
        return;
    }
    const newSession = createSession(name);
    sessions.push(newSession);// 将新会话添加到sessions数组中 


    saveSessions(sessions);// 保存更新后的会话列表 
    renderSessions();// 会话列表渲染  
    switchSession(newSession.id);// 切换到新会话 


    newx.value = "";// 清空输入框的值
    alert("会话已成功添加！");
}


apply.addEventListener("click", color);


button.addEventListener("click", function (t) {
    chati();
});//若侦测到button被click，执行function
text.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        chati();
    }
})


add.addEventListener("click", add1);
newadd.addEventListener("click", add1);
newx.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        add1();
    }
})
