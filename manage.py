from flask import render_template
from flask.ext.script import Manager, Shell

from app import create_app
from config import basedir


def get_env():
    """
    Figure out environment from the application path
    """
    if 'test' in basedir:
        return 'test'
    if 'revmic' in basedir:
        return 'prod'
    if 'michael' in basedir:
        return 'dev'
    return 'default'

app = create_app(get_env())
manager = Manager(app)


def make_shell_context():
    return dict(app=app)

manager.add_command("shell", Shell(make_context=make_shell_context))


@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html", title='Canopy Care')


if __name__ == '__main__':
    manager.run()
