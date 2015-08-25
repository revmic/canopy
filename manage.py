import os

from flask import render_template, request, jsonify
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

app.config['MAIL_RECIPIENTS'] = ['mhilema@gmail.com', 'mhilema@yahoo.com',
                                 'rachel@canopy.care', 'neal@canopy.care',
                                 'rchlmnd006@gmail.com']
# app.config['MAIL_RECIPIENTS'] = ['mhilema@gmail.com', 'rachel@canopy.care']
app.config['MAIL_SUBJECT_PREFIX'] = '[CanopyCare]'
app.config['MAIL_SENDER'] = 'CanopyCare Admin <admin@canopycare.com>'
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'


# TODO get views figured out w/ or w/o blueprints, can't go here
@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
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
    except Exception:
        return jsonify(status='FAIL')

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

    # TODO email file
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


if __name__ == '__main__':
    manager.run()
