import os

from flask import render_template, request, jsonify, send_from_directory
from flask.ext.script import Manager, Shell
from flask.ext.mail import Message

from app import create_app, mail
from app.forms import ContactForm
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

if get_env() == 'prod':
    app.config['MAIL_RECIPIENTS'] = \
        ['mhilema@gmail.com', 'rachel@canopy.care',
         'neal@canopy.care', 'sergi@canopy.care']
else:
    app.config['MAIL_RECIPIENTS'] = ['mhilema@gmail.com']
app.config['MAIL_SUBJECT_PREFIX'] = '[CanopyCare]'
app.config['MAIL_SENDER'] = 'CanopyCare Support <support@canopy.care>'
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'


# TODO get views figured out w/ or w/o blueprints, can't go here
@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
@app.route('/seattle', methods=['GET'])
def index():
    return render_template("index.html", title='Canopy Care')


@app.route('/api/contact', methods=['POST'])
def contact():
    form = ContactForm(
        name=request.form['name'],
        email=request.form['email'],
        phone=request.form['phone'],
        zip=request.form['zip'],
        message=request.form['message']
    )

    print(request.form['name'], "sending a message\n", request.form['message'])

    msg = Message(app.config['MAIL_SUBJECT_PREFIX'] + ' ' + 'Consultation',
                  sender=app.config['MAIL_SENDER'],
                  recipients=app.config['MAIL_RECIPIENTS'])
    msg.html = render_template('inquiry.html', form=form)

    try:
        mail.send(msg)
    except Exception as e:
        print("EXCEPTION:", e)
        response = jsonify(code=e.args[0], message=str(e.args[1]))
        response.status_code = e.args[0]
        return response

    return jsonify(status='OK', name=request.form['message'])


@app.route('/api/upload', methods=['POST'])
def upload():
    f = request.files['file']
    upload_dir = os.path.join(basedir, 'app/static/uploads')
    abs_file_path = os.path.join(upload_dir, f.filename)
    print("INFO: Uploading " + f.filename + " to " + upload_dir)

    if not os.path.exists(upload_dir):
        os.mkdir(upload_dir)

    # TODO check for file size and maybe extension

    # Save to filesystem
    f.save(os.path.join(upload_dir, f.filename))
    file_size = os.path.getsize(os.path.join(upload_dir, f.filename))

    form = ContactForm(
        message="See attached resume."
    )

    msg = Message(app.config['MAIL_SUBJECT_PREFIX'] + ' ' + 'Applicant',
                  sender=app.config['MAIL_SENDER'],
                  recipients=app.config['MAIL_RECIPIENTS'])
    # msg.html = render_template('', form=form)

    # print(f.filename)
    # print(f.content_type)
    with app.open_resource(abs_file_path) as fp:
        msg.attach(f.filename, f.content_type, fp.read())

    try:
        mail.send(msg)
    except Exception:
        return jsonify(status='FAIL')

    return jsonify(status='OK', name=f.filename, size=file_size)


@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


if __name__ == '__main__':
    manager.run()
