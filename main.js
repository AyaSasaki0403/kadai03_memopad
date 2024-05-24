// 追加箇所
$(document).ready(function () {
    let uploadedFileUrl = "";

    // ファイルアップロードの処理
    document.getElementById('fileLocation').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedFileUrl = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('regiDate').addEventListener('change', function() {
        var chosenDate = new Date(this.value);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        chosenDate.setHours(0, 0, 0, 0);
    
        if (chosenDate <= today) {
        } else{
            alert('選択された日付は未来の日付です。今日より前の日付を選択してください。');
            this.value = ''; // 日付をリセット
        }
    });
    
    document.getElementById('dueDate').addEventListener('change', function() {
        var chosenDate = new Date(this.value);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
    
        if (chosenDate < today) {
            alert('選択された日付は過去の日付です。未来の日付を選択してください。');
            this.value = ''; // 日付をリセット
        }
    });

    $("#save").on("click", function (){
        const key =$("#pj").val();
        const value = {
            pj: $("#pj").val(),
            regiDate: $("#regiDate").val(),
            dueDate: $("#dueDate").val(),
            priority: $("#priority").val(),
            taskCon: $("#taskCon").val(),
            fileLocation: uploadedFileUrl,
            noteCon: $("#noteCon").val(),
        };
    
        localStorage.setItem(key, JSON.stringify(value));
        appendTaskToPriorityList(key, value);

        $("#pj").val("");
        $("#regiDate").val("");
        $("#dueDate").val("");
        $("#priority").val("high");
        $("#taskCon").val("");
        $("#fileLocation").val("");
        $("#noteCon").val("");
        uploadedFileUrl = "" 
    });

    function appendTaskToPriorityList(key, value) {
        let fileLink = '';
        if (value.fileLocation) {
            fileLink = `<p>関連資料： <a href="${value.fileLocation}" target="_blank">リンク</a></p>`;
        }

        const html =`
        <div class="pj-box" data-key="${key}">
          <li>
                 <p class="hidden">${key}</p>
                 <p>プロジェクト名: ${value.pj}</p>
                 <p>登録日: ${value.registerDate}</p>
                 <p>期限: ${value.dueDate}</p>
                 <p>優先度: ${value.priority}</p>
                 <p>作業内容: ${value.taskCon}</p>
                 ${fileLink}
                 <p>備考：${value.noteCon}</p>
                 <button class="finish-btn">完了</button>
          </li>
        </div>
        `;

        
        if (value.priority === 'high') {
            $("#priorityHighList").append(html);
        } else if (value.priority === 'middle') {
            $("#priorityMidList").append(html);
        } else if (value.priority === 'low') {
            $("#priorityLowList").append(html);
        }

        $(".finish-btn").off("click").on("click", function() {
            const parent = $(this).closest(".pj-box");
            const key = parent.data("key");
            localStorage.removeItem(key);
            parent.remove();
        });
    }

    for(let i = 0; i <localStorage.length; i++){
         const key = localStorage.key(i);
         const value = JSON.parse(localStorage.getItem(key));
         appendTaskToPriorityList(key, value);
    }
});