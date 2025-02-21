# PDF Load Testing

Load testing for DFA's PDF service is accomplished with **Locust**, a load testing framework written in Python. For more specific information and documentation regarding Locust,
please visit [locust.io](https://locust.io/).

## Requirements
To load test the PDF service, you will require the following to be installed prior to continuing:
* Python 3.10 or above;
* [`pyenv`](https://github.com/pyenv/pyenv); and
* `python3.10-venv` if you are using a Linux/UNIX distribution (including Windows Subsystem for Linux/WSL).

## Setup Instructions
1. Set up a Python virtual environment to isolate the installation of Python packages and frameworks with `pyenv virtualenv dfa-pdf-load-test`. Then, activate it with `pyenv activate dfa-pdf-load-test`.
1. Install all of the necessary packages and frameworks with `pip install -r requirements.txt`.
1. Verify your Locust installation with `locust -V`.
1. To initialize Locust, navigate first to the `/src` directory. Then, run:
   ```
   locust --host=https://dfa-public-sector-pdf-dev.apps.silver.devops.gov.bc.ca
   ```
1. Navigate to http://localhost:8089 to run load tests against the PDF service.