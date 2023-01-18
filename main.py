from gui_class import *
import webview
from subprocess import Popen, PIPE

host: str = "localhost"
port: int = 10000
window_name: str = "ProcExp"

window = Window(
	window_name=window_name, 
	window_position=WINDOW_CENTERED, 
	window_mode=WINDOW_FULL_SCREEN
)
w = window.get_root()

Popen(
	f"php -S {host}:{port} -t /home/$USER/programs/taskmanager",
	stdout=PIPE,
	stdin=PIPE,
	shell=True
)

webview.create_window(window_name, f"http://{host}:{port}/taskmanager.php")
webview.start()
