# SAE Dashboard API Test Suite

This folder contains the unit and integration tests for the FastAPI-based SAE Dashboard API.

## Setup
Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the required packages before running the tests:

```bash
pip install -r requirements_test.txt
```

Make sure the FastAPI app in `service/` can be imported. Be sure to run tests from the project root!


## Usage    
To run all tests:
```bash
pytest 
```

To run a specific file:
```bash
pytest tests/controllers/test_map.py
```

To run a specific test in a file:
```bash
pytest tests/controllers/test_map.py::test_function_name
```

To run with coverage:
```bash
pytest --cov=service --cov-report=term-missing
```

## Adding New Tests
1. Use the format `test_<feature>.py` for new test files and `test_<behavior>` for functions.
2. Use the shared client fixture from `tests/conftest.py`. 
3. Patch helper functions (e.g. get_dataframe) as needed using unittest.mock.patch.
4. Keep each test function focused and descriptive.


