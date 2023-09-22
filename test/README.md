## Installation

To install pytest, use the package manager [pip](https://pip.pypa.io/en/stable/).

```bash
pip install pytest
```

Follow the instructions in ```/service/README.md``` to set up the API server.

## Usage
To run the test suite in the terminal, use the following command:
```bash
pytest -m [target dashboard]
```
For example, runing `pytest -m sfpet` will execute the test suite for the SFPET dashboard.
For a complete list of tags and corresponding dashboards, please refer to the `controllers/pytest.ini` file.

## Creating New Tests
To add new test cases to the API test suite, navigate to the `/controllers` directory and find the class with a docstring marked with the pytest.mark.api marker (e.g., TestDotName). This class serves as the base for all dashboard tests in that file and provides a description of what is being tested. Locate the specific test you want to extend and find the corresponding subclass (e.g., TestDotNameKenya). Inside that class, you'll find a similarly named test function containing a list of parameters and test cases, like this:

```python
@pytest.mark.parametrize("channel, subgroup, countries", [("RFK4", "all", ["Kenya"])])
```
To add a new test case, simply add a new tuple of values to this parameter list.


## Directory Structure
- `/controllers` contains all automated API tests. These tests are designed to work with all dashboards and are executed using the aforementioned commands.
- `/robotframework-bdd` contains client tests using the [Robot framework](https://robotframework.org/).
- `/view` contains client tests using [Selenium](https://pypi.org/project/selenium/). This directory provides tools to validate specific features of the client, such as clicking on a particular country.
- `/k8s` contains files used by test for website deployment via [Kubernetes](https://kubernetes.io/).
