import pathlib
from setuptools import setup, find_packages

HERE = pathlib.Path(__file__).parent

VERSION = '0.1.0'
PACKAGE_NAME = 'socialMediaApp'
AUTHOR = 'Luka Klincarevic'
URL = 'https://github.com/you/your_package'

DESCRIPTION = 'A demo social media app using Macrometa'
LONG_DESCRIPTION = (HERE / "README.md").read_text()
LONG_DESC_TYPE = "text/markdown"

INSTALL_REQUIRES = [
      'numpy',
      'json',
      'requests',
      'flask',
      'time',
      'pandas'
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