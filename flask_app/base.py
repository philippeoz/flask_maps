import os
from flask import (
    Blueprint, request, render_template, jsonify, current_app
)
from models import Marker as DB_Marker
from settings import KEY_G_MAPS as k_maps, KEY_G_ST_VIEW as k_s_view

base_blueprint = Blueprint('base', __name__)


def get_context():
    return {"markers": [{
            'id'        : item.id,
            'lt'        : item.lt,
            'lg'        : item.lg,
            'address'   : item.address,
            'base64'    : item.base64
    } for item in DB_Marker.select()]}


@base_blueprint.route('/')
def index():
    return render_template('main.html', **{'key_g_maps': k_maps, 'key_g_st_view': k_s_view})


@base_blueprint.route('/save_location/', methods=['POST'])
def add_marker():
    kwargs = {
        'lt'        : request.form['lat'],
        'lg'        : request.form['lng'],
        'address'   : request.form['address'],
        'base64'    : request.form['base64']
    }
    
    obj = DB_Marker(**kwargs)
    obj.save()

    return jsonify({'result': 'teste'})


@base_blueprint.route('/get_location/', methods=['POST'])
def get_markers():
    return jsonify(get_context())

@base_blueprint.route('/delete_location/', methods=['POST'])
def delete_marker():
    mk_id = request.form['id']
    mk = DB_Marker.get(id=mk_id)
    mk.delete_instance()
    return jsonify({'ok':'ok'})
