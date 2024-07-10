from flask import Flask, render_template, request, jsonify
import json
import jinja2

app = Flask(__name__)

children = """Бадерко Макар Александрович
Баранов Александр Иванович
Бобров Даниил Анатольевич
Волков Андрей Александрович
Голубцов Артём Валерьевич
Джалилов Артём Ильясович
Дымшаков Михаил Павлович
Жук Александр Романович
Захаров Тимур Сергеевич
Кулибаба Степан Максимович
Курочкин Максим Николаевич
Лощинин Николай Олегович
Михайлова Вера Максимовна
Обозов Марк Алексеевич
Пирахмедов Тимур Александрович
Стукун Даниил Александрович
Шагеев Эмир Салаватович
Шевченко Илья Геннадьевич""".split("\n")


def load_states():
    try:
        with open('checkbox_states.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


@app.route('/')
def main():
    states = load_states()
    return render_template('child.html', states=states, children_count=len(states), children=children)


@app.route('/get_update')
def get_update():
    states=load_states()
    return jinja2.Environment().from_string("""<div class="checkbox-container">
                {% for i in range(children_count) %}
                <div class="checkbox-item label {% if states.get('checkbox' ~ i, False) %}checked{% endif %}">
                    <label for="checkbox{{ i }}">{{ children[i] }}</label>
                </div>
                {% endfor %}
            </div>""").render(states=states, children_count=len(states), children=children)


@app.route('/curator')
def curator():
    states = load_states()
    return render_template('curator.html', states=states, children_count=len(states), children=children)


@app.route('/save_state', methods=['POST'])
def save_state():
    data = request.json
    checkbox_id = data['id']
    state = data['state']

    states = load_states()
    states[checkbox_id] = state

    with open('checkbox_states.json', 'w') as f:
        json.dump(states, f)

    return jsonify({"message": "State saved successfully"})


@app.route('/save_all_states', methods=['POST'])
def save_all_states():
    states = request.json

    with open('checkbox_states.json', 'w') as f:
        json.dump(states, f)

    return jsonify({"message": "All states saved successfully"})


if __name__ == '__main__':
    app.run(debug=True, port=8000)
