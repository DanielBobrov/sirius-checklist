function getTeamName() {
    // Получаем полный URL
    const fullURL = document.URL;

    // Разбиваем URL на части по символу "/"
    const parts = fullURL.split('/');

    // Возвращаем последний элемент массива
    return parts[parts.length - 1];
}

function call_error(text) {
    let error = document.querySelector("#error");
    error.textContent = text;
    error.classList.remove('hidden');
}


$(document).ready(function () {
    let textarea = document.querySelector("#team_list");
    textarea.addEventListener('input', autoResize(this), false);

    function autoResize(elem) {
        return function () {
            elem.style.height = 'auto';
            elem.style.height = elem.scrollHeight + 'px';
        }
    }

    autoResize(textarea)();

    let submit_bnt = document.querySelector(".btn");
    submit_bnt.addEventListener("click", function () {
        let team_name = getTeamName();
        let new_team_name = document.getElementById("team_name").value;
        let team_list = document.getElementById("team_list").value;
        if (new_team_name === "" || team_list === "") {
            call_error("Заполните все поля");
            return false;
        }
        $.ajax({
            url: '/edit_team/' + team_name,
            method: 'POST',
            data: JSON.stringify({
                team_name: new_team_name,
                team_list: team_list,
            }),
            contentType: 'application/json',
            success: function (response) {
                console.log('State saved successfully');
                window.location.replace('/curator/' + new_team_name);
            },
            error: function (response) {
                console.error('Response:', response);
                call_error("Произошла какая-то ошибка :(");
            }
        });
    })
});