import os
import sys
import gzip
import re

from locallib.logger import SystemLogger


class FileHanlder(SystemLogger):
    def __init__(self, directory=None, selected_file=None, batch_size=50 * 1024 * 1024):
        # TODO(David): Check file type before alocating pointer
        self._validations(directory=directory, selected_file=selected_file)

        self._directory = directory
        self._selected_file = selected_file

        self.all_files_to_read_from = []
        self.all_read_files = []

        self.batch_size = batch_size

        self._current_file_name = None
        self._current_file_pointer = None

        self.more_data_is_available = False

        self._run_preparations()

        SystemLogger.__init__(self, name="FileHandler", debug_enabled=True)

    def _validations(self, directory, selected_file):
        if directory != None and selected_file != None:
            raise Exception(
                f"unable to use both directory and selected_file. Please use only one parameter")

        if directory == None and selected_file == None:
            raise Exception(f"invalid input")

        if directory != None and not isinstance(directory, str):
            raise TypeError(
                f"invalid type for directory. Required type is string, but received '{type(directory)}'")

        if selected_file != None and not isinstance(selected_file, str):
            raise TypeError(
                f"invalid type for selected_file. Required type is string, but received '{type(selected_file)}'")

        if directory and not os.path.exists(directory):
            raise IOError(f"directory '{directory}' doesn't exist")

        if selected_file and not os.path.exists(selected_file):
            raise IOError(f"selected file'{selected_file}' doesn't exist")

    def _run_preparations(self):
        if self._directory != None:
            for each_file in os.listdir(os.path.abspath(self._directory)):
                self.all_files_to_read_from.append(os.path.join(
                    os.path.abspath(self._directory), each_file))

            return

        if self._selected_file != None:
            self.all_files_to_read_from.append(
                os.path.abspath(self._selected_file))
            return

    def _set_file_pointer(self):
        if self._current_file_name:
            self.all_read_files.append(self._current_file_name)

            if not len(self.all_files_to_read_from):
                self.more_data_is_available = False

                return

        self._current_file_name = self.all_files_to_read_from.pop()

        self.more_data_is_available = True

        self._current_file_pointer = gzip.open(self._current_file_name, "rb")

    def read_data(self):
        """read_data will start reading either file by file (when directory is selected) or the selected_file only

        Returns:
            string - data with size < batch size
        """
        if self._current_file_pointer == None:
            self._set_file_pointer()

        temp_batch_size = 0
        temp_string = ""
        while temp_batch_size < self.batch_size:
            temp_line = self._current_file_pointer.readline()

            if not temp_line:
                self._set_file_pointer()

                if not self.more_data_is_available:
                    return temp_string

            
            encoding = 'utf-8'
            temp_line = str(temp_line, encoding)
            """
            removing non-latin characters as it causes failure in data import to database as
            database may not support the non latin characters 
            """
            temp_line = re.sub(r'[^\x00-\x7f]',r'', temp_line)
            temp_string += str(temp_line)
            temp_batch_size += len(temp_line)

        return temp_string
