let text = document.querySelector(".文字栏");
let button = document.querySelector(".按钮");
let pzx = document.querySelector(".pzx");
let add = document.querySelector(".add");
let newx = document.querySelector(".new");
let newadd = document.querySelector(".newsbutton");
let operationPanel = document.querySelector(".操作面板");
let apply = document.querySelector("#apply");
let input = text.value.trim();


window.onload = function () {
    loadcolor();
    renderSessions();
};


function color() {
    var colorchooser = document.querySelector("#colorchooser");
    var themecolor = colorchooser.value;

    operationPanel.style.backgroundColor = themecolor;
    localStorage.setItem('savedcolor', themecolor);
}


function loadcolor() {
    var usedcolor = localStorage.getItem('savedcolor');
    colorchooser.value = usedcolor;
    if (usedcolor) {
        operationPanel.style.backgroundColor = usedcolor;
    }
}


function scroll(n) {
    n.scrollTop = n.scrollHeight;
}


function createSession(name) {
    return {
        id: Date.now().toString(),
        name: name,
        content: []
    };
}


function loadSessions() {
    const sessionsJson = localStorage.getItem('sessions');
    return sessionsJson ? JSON.parse(sessionsJson) : [];
}


function saveSessions(sessions) {
    localStorage.setItem('sessions', JSON.stringify(sessions));
}


let sessions = loadSessions();
let currentSessionId = null;

function switchSession(sessionId) {
    const currentSession = sessions.find(session => session.id === sessionId);
    if (currentSession) {
        currentSessionId = sessionId;
        const meetingList = document.querySelector('.会话');
        meetingList.innerHTML = '';
        sessions.forEach(session => {

            const li = document.createElement('li');
            li.textContent = session.name;//li的文本内容为会话名
            li.dataset.sessionId = session.id;//li所指向的会话id为session.id

            const deleteButton = document.createElement('button');//为每一个会话创建一个button,dom名是deleteButton

            deleteButton.textContent = '🗑️'; //deletebutton的文本内容是🗑️
            deleteButton.dataset.sessionId = session.id; // deleteButton所指向的会话id就是session.id  
            deleteButton.className = 'delete-button'; // 给delete添加一个class  


            li.appendChild(deleteButton); // 将deleteButton添加到会话项中

            li.addEventListener('click', () => switchSession(session.id));
            deleteButton.addEventListener('click', () => deleteSession(session.id));
            if (session.id === currentSessionId) {
                li.classList.add('now-session');
            } else {
                li.classList.remove('now-session');
            }
            meetingList.appendChild(li);
        });

        const chat = document.querySelector('.chat');
        chat.innerHTML = '';
        currentSession.content.forEach(message => {
            const li = document.createElement('li');
            li.textContent = message;
            chat.appendChild(li);
        });
        scroll(chat.parentElement);
    }

    function renderSessions() {
        const meetingList = document.querySelector('.会话');
        meetingList.innerHTML = '';
        sessions.forEach(session => {

            const li = document.createElement('li');
            li.textContent = session.name;
            li.dataset.sessionId = session.id;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.dataset.sessionId = session.id;
            deleteButton.className = 'delete-button';


            li.appendChild(deleteButton);
            li.addEventListener('click', () => switchSession(session.id));

            deleteButton.addEventListener('click', () => deleteSession(session.id));
            meetingList.appendChild(li);
        });
    }


    function deleteSession(sessionId) {
        const sessionIndex = sessions.findIndex(session => session.id === sessionId);
        if (sessionIndex !== -1) {
            sessions.splice(sessionIndex, 1);
            saveSessions(sessions);
            renderSessions();


            if (currentSessionId === sessionId) {
                switchSession(sessions[0].id);
            }
        }
    }


    function renderChatHistory(history) {
        const chat = document.querySelector('.chat');
        chat.innerHTML = '';


        history.forEach(message => {
            const li = document.createElement('li');
            li.textContent = message;
            chat.appendChild(li);
        });
        scroll(chat.parentElement);
    }


    function chati() {
        let input = text.value.trim();
        if (input === "") {
            alert("请输入点什么!");
            return;
        }

        const currentSession = sessions.find(session => session.id === currentSessionId);
        if (currentSession) {
            let inid = Date.now();
            var chating = document.createElement("li");


            chating.id = "in_" + inid;
            chating.style.color = "red";
            chating.textContent = "USER：" + input;


            const chat = document.querySelector('.chat');
            chat.appendChild(chating);
            currentSession.content.push("USER：" + input);


            let anid = Date.now();
            var answer = document.createElement("li");


            answer.id = "an_" + anid;

            answer.style.color = "blue";
            answer.textContent = "JoTangLM:";


            chat.append(answer);
            currentSession.content.push("JoTangLM:");

            const requestBody = JSON.stringify({
                "messages": [
                    { "role": "user", "content": input }
                ]
            });


            fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=[24.005711c55c17e296a17ab87895a33c98.2592000.1732013880.282335-115931407]', {
                method: 'POST',//请求方式是post
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            })


                .then(response => response.json())
                .then(data => {
                    let botResponse = data.result.toString();
                    show(answer, botResponse);
                    currentSession.content[currentSession.content.length - 1] = "JoTangLM: " + botResponse;
                    saveSessions(sessions);
                })
                .catch(error => {
                    let botResponse = '啊哦,好像出现了一些问题';
                    show(answer, botResponse);
                    currentSession.content[currentSession.content.length - 1] = "JoTangLM: " + botResponse;
                    saveSessions(sessions);
                });

            scroll(chat.parentElement);
        }

        text.value = "";
    }


    function show(x, y) {
        let i = 0;
        let show = setInterval(function () {
            if (i <= y.length) {
                x.textContent += y.charAt(i);
            }
            else {
                clearInterval(show);
            }
            scroll(pzx);
        }, 100)
    }



    function add1() {
        let name = newx.value.trim();
        if (name === "") {
            alert("名称不能为空！");
            return;
        }
        const newSession = createSession(name);
        sessions.push(newSession);


        saveSessions(sessions);
        renderSessions();
        switchSession(newSession.id);


        newx.value = "";
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
