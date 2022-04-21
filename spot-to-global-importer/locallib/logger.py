import os
import sys
import datetime
import logging


class SystemLogger(logging.Logger):
    def __init__(self, name, logging_dir_full_path=None, debug_enabled=False):
        if not isinstance(debug_enabled, bool):
            raise TypeError("{}: invalid type for 'debug_enabled' parameter. Expecting: bool, got {}".format(
                self.__class__.__name__, type(debug_enabled)))

        if not isinstance(name, str):
            raise TypeError("{}: invalid type for 'name' parameter. Expecting: string, got {}".format(
                self.__class__.__name__, type(name)))

        if logging_dir_full_path and not isinstance(logging_dir_full_path, str):
            raise TypeError("{}: invalid type for 'logging_dir_full_path' parameter. Expecting: string, got {}".format(
                self.__class__.__name__, type(name)))

        logging.Logger.__init__(self, name=name)

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

        consoleHandler = logging.StreamHandler(sys.stdout)

        if debug_enabled:
            consoleHandler.setLevel(logging.DEBUG)
        else:
            consoleHandler.setLevel(logging.INFO)

        consoleHandler.setFormatter(formatter)

        self.addHandler(consoleHandler)

        if logging_dir_full_path:
            # TODO(David): Missing file write access validation
            time_started = datetime.datetime.now().strftime("%d-%m-%y-%H-%M-%S")

            file_handler = logging.FileHandler(full_file_name)
            full_file_name = "{}-{}".format(os.path.join(
                logging_dir_full_path, name), time_started)

            if debug_enabled:
                file_handler.setLevel(logging.DEBUG)
            else:
                file_handler.setLevel(logging.INFO)

            file_handler.setFormatter(formatter)

            self.addHandler(file_handler)
