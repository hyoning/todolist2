let infoTitle = document.querySelector('.info_title')
let infoText = document.getElementById('info_text');
let infoDate = document.getElementById('info_date');
let plusBtn = document.getElementById('plus_Btn');
let todoCont = document.querySelector('.todo--list ul');
let todoTap = document.querySelectorAll('.todo--tab ul li');
let underLine = document.querySelector('.underline');
let todoTapFirst = document.getElementById('all');
let infoWrap = document.querySelector('.info--wrap');
let addBtn = document.getElementById('add_Btn');
let closeBtn = document.getElementById('close_Btn');

let mode = 'all'
let todoList = []
let list = []

let selectedTodoId = null; // 수정할 할 일의 ID를 저장할 변수 추가

// add button 클릭 후 input popup 노출
addBtn.addEventListener('click', function(){
    plusBtn.innerHTML = "추가하기";
    infoTitle.innerHTML = "할 일 추가";
    infoWrap.classList.add('on');
    infoText.value="";
    infoDate.value="";
    selectedTodoId = null; // 추가 시에는 선택된 할 일 ID 초기화
})

// x버튼 클릭 후 input popup 숨기기
closeBtn.addEventListener('click', function(){
    infoWrap.classList.remove('on');
})


//input 입력 후 추가 버튼 클릭
plusBtn.addEventListener('click', function(){
        if(infoText.value ==''){
            alert('할일을 입력해주세요');
            return;
        } else if(infoDate.value ==''){
            alert('날짜를 입력해주세요');
            return;
        }
        if (selectedTodoId !== null) {
            // 선택된 할 일의 정보를 업데이트합니다.
            const todo = todoList.find((item) => item.id === selectedTodoId);
            todo.content = infoText.value;
            todo.date = infoDate.value;
            selectedTodoId = null; // 수정 완료 후 선택된 할 일 ID 초기화
            render(); // 수정 완료 후 화면에 노출
        } else {
            addTodo(); // 선택된 할 일이 없을 경우 새로운 할 일 추가
        }
        infoWrap.classList.remove('on');
        console.log(todoList);
})

//input focus일때 input비우기
infoText.addEventListener("focus", function(){
    infoText.value="";
})


//초기 underLine 위치
underLine.style.left= todoTapFirst.offsetLeft + "px"
underLine.style.width= todoTapFirst.offsetWidth + "px"


//탭 클릭
for (let i=0; i<todoTap.length; i++){
    todoTap[i].addEventListener('click', function(event){
        const selected = document.querySelector('.selected');
        if(selected){
            selected.classList.remove('selected');
        }
        underLine.style.left=event.currentTarget.offsetLeft + "px"
        underLine.style.width=event.currentTarget.offsetWidth + "px"
        mode = event.target.id;
        render();
        event.currentTarget.classList.add('selected');
    })
}

function addTodo(){
    let info = {
        id :  Math.random().toString(36).substr(2, 9),
        content : infoText.value,
        isComplete : false,
        edit : false,
        date : infoDate.value
    }
    todoList.push(info);
    render();
}   
  
// 할 일 리스트
function render(){
    list = []
    if(mode == 'all'){
        list = todoList
    } else if(mode == 'active'){
        list = todoList.filter((info) => info.isComplete === false);
    } else if(mode == 'end'){
        list = todoList.filter((info) => info.isComplete === true);
    }
    let resultHTML = "";
    for(let i=0; i<list.length; i++){
        resultHTML += `
        <li class="task ${list[i].isComplete==true?`done`:``}">
            <div class="check-box">
                <button id="check_btn" onClick="checked('${list[i].id}')" type="button"></button>
            </div>
            <div class="taskCont--Wrap">
            <div class="task-cont">
                <div class="cont">${list[i].content}</div> 
                <div class="date">${list[i].date}</div>
            </div>
            <div class="task-btn">
                <button id="modify_btn" onClick="modify('${list[i].id}')" type="button"></button>
                <button id="delete_btn" onClick="deleted('${list[i].id}')"  type="button"></button>
            </div>
            </div>
        </li>
        `
    }
    todoCont.innerHTML = resultHTML;
}

// 체크박스
function checked(id){
   for(let i=0; i<todoList.length; i++){
    if(todoList[i].id == id){
        todoList[i].isComplete = !todoList[i].isComplete;
        break;
    }
   }
   render();
}

// 할 일 목록 삭제
function deleted(id){
    if(confirm("정말 삭제하시겠습니까?")){
     todoList = todoList.filter((item) => item.id != id);
    }
    render();
}

// 수정 버튼 클릭 시 수정할 할 일 ID를 저장하고 팝업 노출
function modify(id) {
    selectedTodoId = id; // 수정할 할 일의 ID 저장
    const todo = todoList.find((item) => item.id === id);
    plusBtn.innerHTML = "수정하기";
    infoTitle.innerHTML = "할 일 수정";
    infoWrap.classList.add('on');
    infoText.value = todo.content;
    infoDate.value = todo.date;
}

// 달력 위젯
$(function(){
    $('input[name="dates"]').daterangepicker({
        changeMonth:true,
        singleDatePicker: true,
    });
    $('input[name="dates"]').datepicker('setDate', 'today'); 
});
