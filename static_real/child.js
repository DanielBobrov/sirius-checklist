function getTeamName() {
    // Получаем полный URL
    const fullURL = document.URL;

    // Разбиваем URL на части по символу "/"
    const parts = fullURL.split('/');

    // Возвращаем последний элемент массива
    return parts[parts.length - 1];
}


function _0x1hl439() {
    let team_name = getTeamName();
    // console.log(getTeamName());
    $.ajax({
        url: '/get_update/' + team_name,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            let cont = document.querySelector(".checkbox-container")
            cont.innerHTML = response;
        },
        error: function (xhr, status, error) {
            console.error('Error saving state:', error);
        }
    });
}

let interval = setInterval(_0x1hl439, 3000);