"""
Copy this file's contents into the WSGI file shown on PythonAnywhere's Web tab.

Before using it, replace:
- YOURUSERNAME
- go_green_tech (if your folder name is different)
"""

import os
import sys
from pathlib import Path

PROJECT_ROOT = Path("/home/YOURUSERNAME/go_green_tech")
BACKEND_ROOT = PROJECT_ROOT / "backend"

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
