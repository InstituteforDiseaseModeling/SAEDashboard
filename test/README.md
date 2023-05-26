## Setup

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install pytest.

```bash
pip install pytest
```

Follow the steps in ```/service/README.md``` to set up a server for the API.



## Usage
To run the test suite in terminal, use:
```bash
pytest -m [target dashboard]
```
For example, ```pytest -m sfpet``` would run the test suite for the SFPET dashboard.
For a complete list of tags and corresponding dashboards please refer to the ```controllers/pytest.ini``` file.

## Creating New Tests
To extend the cases covered by the API test suite, navigate to the ```/controllers``` directory and refer to the docstring of the class in each file marked with the ```pytest.mark.api``` marker (for example, ```TestDotName```). This is the generic class that is the basis for all dashboard tests in that file, and contains the description of exactly what is being tested. Locate the test you wish to extend, and navigate to the corresponding subclass (for example ```TestDotNameKenya```). Locate the similarly named test function in that class and there there should be a list of parameters and test cases that looks like:
```python
@pytest.mark.parametrize("channel, subgroup, countries", [("RFK4", "all", ["Kenya"])])
```
To add a test case, add a new tuple of values to this parameter list.

## Navigation
- ```/controllers``` contains all automated API tests. These tests are generalized to all dashboards, and are the ones which are run via the commands above.
- ```/robotframework-bdd``` contains client tests using the [Robot framework](https://robotframework.org/).
- ```/view``` contains client tests using [Selenium](https://pypi.org/project/selenium/). This is a collection of tools to check specific features of the client such as clicking on a particular country. 
- ```/k8s``` contains files used by test for website deployment via [Kubernetes](https://kubernetes.io/).