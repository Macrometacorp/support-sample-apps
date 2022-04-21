import os
import gzip

from datetime import datetime

from locallib.logger import SystemLogger


class FileHanlder(SystemLogger):
    def __init__(self, write_to_dir, file_prefix, max_write_iterations=2):
        # TODO(David): Missing folder creation
        self._validations(write_to_dir=write_to_dir)

        self.location_directory = write_to_dir
        self.file_prefix = file_prefix

        self._current_file_iteration = 0
        self.all_files_created = []
        self._file_pointer = None
        self._current_write_iteration = None

        self._write_starterd_time = datetime.now().strftime("%m%d%YT%H%M%S")

        self._create_new_file_name()
        self._create_new_file_pointer()

        self._max_write_iterations = max_write_iterations

        SystemLogger.__init__(self, name="FileHandler", debug_enabled=True,
                              logging_dir_full_path=self.location_directory)

    def _validations(self, write_to_dir):
        """validates class parameters on init

        Raises:
            ValueError: wrong type of input parameter
            FileNotFoundError: when location directory isn't found
            IOError: when location directory isn't writable
        """
        if not isinstance(write_to_dir, str):
            raise ValueError(
                f"'write_to_dir' should be string, not {type(write_to_dir)}")

        if not os.path.exists(write_to_dir):
            raise FileNotFoundError(f"directory '{write_to_dir}' not found")

        if not os.access(write_to_dir, os.W_OK):
            raise IOError(f"directory '{write_to_dir}' isn't writable")

    def _create_new_file_name(self):
        self._current_file_iteration += 1

        self._current_file_name = f"{self.file_prefix}-export-{self._write_starterd_time}-file-{self._current_file_iteration}.gz"
        self.all_files_created.append(self._current_file_name)
        self._current_file_full_path = os.path.join(
            self.location_directory, self._current_file_name)

        self._current_write_iteration = 0

    def _create_new_file_pointer(self):
        old_file_full_path = self._current_file_full_path

        if not self._file_pointer:
            self._file_pointer = gzip.open(self._current_file_full_path, "wb")

            return

        self._file_pointer.close()

        self._create_new_file_name()

        self._file_pointer = gzip.open(self._current_file_full_path, "wb")

        self.info(
            f"changing file pointer from file '{old_file_full_path}' to '{self._current_file_full_path}'"
        )

    def write_to_file(self, content):
        """appends 'content' to file

        Params: 
            content (str): desired content to append

        Returns:
            ValueError: when 'content' value isn't string
        """

        if not isinstance(content, str):
            raise ValueError(f"'content' value should be string")

        if len(content) == 0:
            return

        self._file_pointer.write(content.encode('utf-8'))
        self._file_pointer.flush()

        self._current_write_iteration += 1

        if self._current_write_iteration == self._max_write_iterations:
            self._create_new_file_pointer()

    def close_pointers(self):
        self._file_pointer.close()
