from flask import render_template  # , redirect, url_for, flash, request

import app
# from app import mailer

debug = 'DEBUG'
info = 'INFO'
warn = 'WARN'
error = 'ERROR'


@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html", title='Canopy Care')