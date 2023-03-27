import pathlib
from setuptools import setup, find_packages

HERE = pathlib.Path(__file__).parent

VERSION = '0.1.0'
PACKAGE_NAME = 'markovSolver'
AUTHOR = 'Luka Klincarevic'
URL = 'https://github.com/you/your_package'

DESCRIPTION = 'An app to solve Markov chains using Macrometa graphs'
LONG_DESCRIPTION = (HERE / "README.md").read_text()
LONG_DESC_TYPE = "text/markdown"

INSTALL_REQUIRES = [
      'numpy',
      'json',
      'requests',
      'flask'
]

setup(name=PACKAGE_NAME,
      version=VERSION,
      description=DESCRIPTION,
      long_description=LONG_DESCRIPTION,
      long_description_content_type=LONG_DESC_TYPE,
      author=AUTHOR,
      url=URL,
      install_requires=INSTALL_REQUIRES,
      packages=find_packages()
      )