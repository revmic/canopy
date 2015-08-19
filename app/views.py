from flask import render_template  # , redirect, url_for, flash, request

import app
from app.forms import ContactForm
# from app import mailer

debug = 'DEBUG'
info = 'INFO'
warn = 'WARN'
error = 'ERROR'


@app.route('/')
@app.route('/index')
def index():
    form = ContactForm()

    return render_template("index.html", form=form, title='Canopy Care')