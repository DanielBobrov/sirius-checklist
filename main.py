from flask import Flask, render_template, request, jsonify, redirect, make_response, session
import flask
import json
import jinja2
import os

app = Flask(__name__)
app.secret_key = "SECRET KEY"


def load_states(team_name):
    try:
        with open(f'teams/{team_name}.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return -1


def load_children(team_name):
    try:
        with open(f'teams/{team_name}', 'r') as f:
            return f.read().rstrip().split("\n")
    except FileNotFoundError:
        return -1


def get_teams_list():
    teams_list = []
    for i in os.listdir('teams'):
        if ".json" not in i:
            teams_list.append(i)
    return teams_list


def get_team(team_name):
    with open(f"teams/{team_name}", "r") as f:
        return f.read().rstrip()


def create_team(team_name, team_list):
    if os.path.exists(f'teams/{team_name}'):
        return "team already exists"
    with open(f"teams/{team_name}.json", "w") as f:
        print("{}", file=f)
    with open(f"teams/{team_name}", "w") as f:
        print(*team_list, sep="\n", file=f)
    return True


def edit_team(team_name, team_list):
    with open(f"teams/{team_name}.json", "w") as f:
        print("{}", file=f)
    with open(f"teams/{team_name}", "w") as f:
        print(*team_list, sep="\n", file=f)
    return True


def delete_team(team_name):
    os.remove(f"teams/{team_name}.json")
    os.remove(f"teams/{team_name}")
    return True


def is_curator():
    return session.get("role", None) == "curator"


def is_authorized_team(team):
    role = session.get("role", None)
    if role is None:
        return False
    if team != session.get("team", None):
        return False
    return True


@app.get('/edit_team/<string:team_name>')
def edit_team_page(team_name):
    if session.get("role", None) != "curator":
        return unauthorized()
    team = get_team(team_name)
    return render_template("edit_team.html", team_name=team_name, team_list=team)


@app.post('/edit_team/<string:team_name>')
def edit_team_request(team_name):
    if session.get("role", None) != "curator":
        return unauthorized()
    data = request.json
    match edit_team(data['team_name'], filter(lambda a: a, data['team_list'].split("\n"))):
        case True:
            return make_response("200")
        case _:
            return make_response("400")


@app.get('/create_team')
def create_team_page():
    if session.get("role", None) != "curator":
        return unauthorized()
    return render_template("create_team.html")


@app.post('/create_team')
def create_team_request():
    data = request.json
    match create_team(data['team_name'], filter(lambda a: a, data['team_list'].split("\n"))):
        case True:
            return make_response("200")
        case "team already exists":
            return make_response("team already exists", 500)
        case _:
            return make_response("400")


@app.route('/get_update/<string:team_name>')
def get_update(team_name):
    # print(team_name)
    if not is_authorized_team(team_name):
        return unauthorized()
    states = load_states(team_name)
    children = load_children(team_name)
    return jinja2.Environment().from_string("""<div class="checkbox-container">
                {% for i in range(children_count) %}
                <div class="checkbox-item label {% if states.get('checkbox' ~ i, False) %}checked{% endif %}">
                    <label for="checkbox{{ i }}">{{ children[i] }}</label>
                </div>
                {% endfor %}
            </div>""").render(states=states, children_count=len(children), children=children)


# @app.route('/curator')
# def curator_empty():
#     return render_template("curator_empty.html", teams=get_teams_list())
#
#
# @app.route('/curator/<string:team_name>')
# def curator(team_name):
#     states = load_states(team_name)
#     children = load_children(team_name)
#     return render_template('curator.html', states=states, children_count=len(children), children=children,
#                            team_name=team_name)
@app.route("/curator")
def authorize_curator():
    session["role"] = "curator"
    return make_response("200")


@app.route("/child")
def authorize_child():
    session["role"] = "child"
    return make_response("200")


@app.route('/save_state/<string:team_name>', methods=['POST'])
def save_state(team_name):
    if not is_curator():
        return unauthorized()
    data = request.json
    checkbox_id = data['id']
    state = data['state']

    states = load_states(team_name)
    states[checkbox_id] = state

    with open(f'teams/{team_name}.json', 'w') as f:
        json.dump(states, f)

    return jsonify({"message": "State saved successfully"})


@app.route('/save_all_states/<string:team_name>', methods=['POST'])
def save_all_states(team_name):
    if not is_curator():
        return unauthorized()
    states = request.json

    with open(f'teams/{team_name}.json', 'w') as f:
        json.dump(states, f)

    return jsonify({"message": "All states saved successfully"})


def unauthorized():
    return "Unauthorized"


def my_render(template, team_name):
    states = load_states(team_name)
    children = load_children(team_name)
    if states == -1:
        return redirect(session.get("team_name", "/"))
    return render_template(template, states=states, children_count=len(children), children=children,
                           team_name=team_name)


@app.route('/<string:team_name>')
def multi_team(team_name):
    role = session.get("role", None)
    if role is None:
        return unauthorized()
    if role == "child" and session.get("team_name", None) != team_name:
        return redirect(session.get("team_name", "/"))
    return my_render('child.html' if role == "child" else 'curator.html', team_name)


@app.route('/')
def main():
    if not is_curator():
        return unauthorized()
    return render_template("empty.html", teams=get_teams_list())


if __name__ == '__main__':
    app.debug = True
    app.run(port=8000)
