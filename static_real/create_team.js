function call_error(text) {
    let error = document.querySelector("#error");
    error.textContent = text;
    error.classList.remove('hidden');
}


$(document).ready(function () {
    let textarea = document.querySelector("#team_list");
    textarea.addEventListener('input', autoResize, false);

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    let submit_bnt = document.querySelector(".btn");
    submit_bnt.addEventListener("click", function () {
        let team_name = document.getElementById("team_name").value;
        let team_list = document.getElementById("team_list").value;
        if (team_name === "" || team_list === "") {
            call_error("Заполните все поля");
            return false;
        }
        $.ajax({
            url: '/create_team',
            method: 'POST',
            data: JSON.stringify({
                team_name: team_name,
                team_list: team_list,
            }),
            contentType: 'application/json',
            success: function (response) {
                console.log('State saved successfully');
                window.location.replace('/curator/' + team_name);
            },
            error: function (response) {
                console.error('Response:', response);
                if (response.responseText === "team already exists") {
                    call_error("Команда с таким названием уже существует");
                } else {
                    call_error("Произошла какая-то ошибка :(");
                }
            }
        });
    })
});