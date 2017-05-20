"""
Project settings
"""
import os
from decouple import config

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
DEBUG = True
DATABASE_URL = 'database.db'
MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media_files')
SECRET_KEY = 'mozovo'

KEY_G_MAPS = config('KEY_G_MAPS')
KEY_G_ST_VIEW = config('KEY_G_ST_VIEW')
