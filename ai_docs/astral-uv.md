TITLE: Simple API Function in a uv-initialized Library
DESCRIPTION: Provides an example of a basic Python API function defined in the `__init__.py` file of a library project. This demonstrates a simple `hello` function that returns a string, ready for import and use by consumers.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/concepts/projects/init.md#_snippet_12

LANGUAGE: python
CODE:
```
def hello() -> str:
    return "Hello from example-lib!"
```

----------------------------------------

TITLE: Reproducible Example with uv Commands in Dockerfile
DESCRIPTION: This comprehensive Dockerfile demonstrates creating a self-contained reproducible example by executing a sequence of uv commands directly within the image. It covers initializing a project, adding a dependency (pydantic), synchronizing, and running a Python script to verify the installation.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/troubleshooting/reproducible-examples.md#_snippet_2

LANGUAGE: Dockerfile
CODE:
```
FROM --platform=linux/amd64 ghcr.io/astral-sh/uv:0.5.24-debian-slim

RUN uv init /mre
WORKDIR /mre
RUN uv add pydantic
RUN uv sync
RUN uv run -v python -c "import pydantic"
```

----------------------------------------

TITLE: Initialize Libraries.io API Key and Data Structures in Python
DESCRIPTION: This snippet initializes the necessary components for fetching data from Libraries.io. It sets up an empty API key (which needs to be filled by the user), imports `Path` for file operations and `httpx` for HTTP requests, and prepares a dictionary to store API responses.
SOURCE: https://github.com/astral-sh/uv/blob/main/scripts/popular_packages/pypi_10k_most_dependents.ipynb#_snippet_0

LANGUAGE: python
CODE:
```
"""To update `pypi_10k_most_dependents.txt`, enter your `api_key` from https://libraries.io/account.

The latest version is available at: https://gist.github.com/charliermarsh/07afd9f543dfea68408a4a42cede4be4.
"""

from pathlib import Path

import httpx

api_key = ""
responses = {}
```

----------------------------------------

TITLE: Fetch Python PEPs using requests and pprint
DESCRIPTION: This Python script demonstrates how to fetch data from the Python PEPs API using the `requests` library and pretty-print the results using `rich.pretty.pprint`. It showcases basic API interaction and data processing.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/scripts.md#_snippet_8

LANGUAGE: python
CODE:
```
import requests
from rich.pretty import pprint

resp = requests.get("https://peps.python.org/api/peps.json")
data = resp.json()
pprint([(k, v["title"]) for k, v in data.items()][:10])
```

----------------------------------------

TITLE: Fetch PyPI Package Data from Libraries.io API in Python
DESCRIPTION: This code iterates 100 times to fetch 100 pages of data, each containing 100 PyPI packages, from the Libraries.io API. It constructs the API URL with parameters for platform, pagination, sorting by dependent count, and the user's API key. The fetched JSON responses are stored in the `responses` dictionary.
SOURCE: https://github.com/astral-sh/uv/blob/main/scripts/popular_packages/pypi_10k_most_dependents.ipynb#_snippet_1

LANGUAGE: python
CODE:
```
for i in range(100):  # 100 pages with 100 per page -> 10k
    print(i)
    if i not in responses:
        # https://libraries.io/api#project-search
        sort = "dependents_count"
        url = f"https://libraries.io/api/search?platforms=Pypi&per_page=100&page={i + 1}&sort{sort}&api_key={api_key}"
        responses[i] = httpx.get(url, timeout=30.0).json()
```

----------------------------------------

TITLE: Example uv Snapshot Test with `uv_snapshot!` Macro
DESCRIPTION: Demonstrates how to use the `uv_snapshot!` macro within a Rust test to simplify creating snapshots for uv commands. This example tests adding 'requests' to a context.
SOURCE: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md#_snippet_3

LANGUAGE: rust
CODE:
```
#[test]
fn test_add() {
    let context = TestContext::new("3.12");
    uv_snapshot!(context.filters(), context.add().arg("requests"), @"");
}
```

----------------------------------------

TITLE: Example pyproject.toml for uv projects
DESCRIPTION: A sample `pyproject.toml` file illustrating how project metadata like name, version, description, and dependencies are defined. This file is central to `uv`'s project management.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/projects.md#_snippet_2

LANGUAGE: toml
CODE:
```
[project]
name = "hello-world"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
dependencies = []
```

----------------------------------------

TITLE: Configure uv Build Backend Options
DESCRIPTION: Comprehensive documentation for all configurable options under `[tool.uv.build-backend]` in `pyproject.toml`, including their purpose, types, default values, and usage examples for managing Python package builds.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_15

LANGUAGE: APIDOC
CODE:
```
[tool.uv.build-backend] Configuration Options:

default-excludes:
  Description: If set to `false`, the default excludes aren't applied. Default excludes: `__pycache__`, `*.pyc`, and `*.pyo`.
  Default value: `true`
  Type: `bool`

module-name:
  Description: The name of the module directory inside `module-root`. The default module name is the package name with dots and dashes replaced by underscores. Package names need to be valid Python identifiers, and the directory needs to contain a `__init__.py`. An exception are stubs packages, whose name ends with `-stubs`, with the stem being the module name, and which contain a `__init__.pyi` file. For namespace packages with a single module, the path can be dotted, e.g., `foo.bar` or `foo-stubs.bar`. For namespace packages with multiple modules, the path can be a list, e.g., `["foo", "bar"]`. Note that using this option runs the risk of creating two packages with different names but the same module names. Installing such packages together leads to unspecified behavior, often with corrupted files or directory trees.
  Default value: `None`
  Type: `str | list[str]`

module-root:
  Description: The directory that contains the module directory. Common values are `src` (src layout, the default) or an empty path (flat layout).
  Default value: `"src"`
  Type: `str`

namespace:
  Description: Build a PEP 420 implicit namespace package, allowing more than one root `__init__.py`. Use this option when the namespace package contains multiple root `__init__.py`, for namespace packages with a single root `__init__.py` use a dotted `module-name` instead.
  Default value: `false`
  Type: `bool`
  Additional Context:
    src
    └── cloud
        └── database
            ├── __init__.py
            ├── query_builder
            │   └── __init__.py
            └── sql
                ├── parser.py
                └── __init__.py

    src
    ├── cloud
    │   ├── database
    │   │   ├── __init__.py
    │   │   ├── query_builder
    │   │   │   └── __init__.py
    │   │   └── sql
    │   │       ├── __init__.py
    │   │       └── parser.py
    │   └── database_pro
    │       ├── __init__.py
    │       └── query_builder.py
    └── billing
        └── modules
            └── database_pro
                ├── __init__.py
                └── sql.py

source-exclude:
  Description: Glob expressions which files and directories to exclude from the source distribution.
  Default value: `[]`
  Type: `list[str]`

source-include:
  Description: Glob expressions which files and directories to additionally include in the source distribution. `pyproject.toml` and the contents of the module directory are always included.
  Default value: `[]`
  Type: `list[str]`

wheel-exclude:
  Description: Glob expressions which files and directories to exclude from the wheel.
  Default value: `[]`
  Type: `list[str]`
```

LANGUAGE: TOML
CODE:
```
[tool.uv.build-backend]
default-excludes = false
```

LANGUAGE: TOML
CODE:
```
[tool.uv.build-backend]
module-name = "sklearn"
```

LANGUAGE: TOML
CODE:
```
[tool.uv.build-backend]
module-root = ""
```

LANGUAGE: TOML
CODE:
```
[tool.uv.build-backend]
namespace = true
```

LANGUAGE: TOML
CODE:
```
[tool.uv.build-backend]
source-exclude = ["*.bin"]
```

LANGUAGE: TOML
CODE:
```
[tool.uv.build-backend]
source-include = ["tests/**"]
```

LANGUAGE: TOML
CODE:
```
[tool.uv.build-backend]
wheel-exclude = ["*.bin"]
```

----------------------------------------

TITLE: Rust API: BaseClientBuild Custom Proxy Support
DESCRIPTION: The `BaseClientBuild` structure in the Rust API has been updated to allow configuration with custom proxies, enhancing network flexibility for clients built with this API.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.6.x.md#_snippet_8

LANGUAGE: Rust
CODE:
```
// Conceptual API change:
// BaseClientBuild now accepts custom proxy configurations.
// Example usage:
// let client_builder = BaseClientBuild::new().with_proxy(my_proxy_config);
```

----------------------------------------

TITLE: Example AWS Lambda Event Payload (GET Request)
DESCRIPTION: This JSON snippet represents a typical event payload for an AWS Lambda function triggered by an HTTP GET request. It includes standard fields like `httpMethod`, `path`, and `requestContext`.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/integration/aws-lambda.md#_snippet_23

LANGUAGE: json
CODE:
```
{
  "httpMethod": "GET",
  "path": "/",
  "requestContext": {},
  "version": "1.0"
}
```

----------------------------------------

TITLE: Example pyproject.toml for uv FastAPI project
DESCRIPTION: Illustrates the `pyproject.toml` configuration file for a `uv` project, specifying project metadata and `fastapi[standard]` as a dependency.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/integration/fastapi.md#_snippet_2

LANGUAGE: TOML
CODE:
```
[project]
name = "uv-fastapi-example"
version = "0.1.0"
description = "FastAPI project"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]",
]
```

----------------------------------------

TITLE: Example AWS Lambda Function Response
DESCRIPTION: This JSON snippet illustrates a typical response structure from an AWS Lambda function, including HTTP status code, headers, and the body content. It demonstrates how a Lambda function might return data for an API Gateway integration.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/integration/aws-lambda.md#_snippet_24

LANGUAGE: json
CODE:
```
{
  "statusCode": 200,
  "headers": {
    "content-length": "14",
    "content-type": "application/json"
  },
  "multiValueHeaders": {},
  "body": "\"Hello, world!\"",
  "isBase64Encoded": false
}
```

----------------------------------------

TITLE: Example constraints.txt for Build Dependency Hashing
DESCRIPTION: This example illustrates the content of a `constraints.txt` file, which is used to pin a specific version of a build dependency (e.g., `setuptools`) and include its SHA256 hash. This mechanism ensures that only the exact, verified version of the dependency is used during the build process, enhancing reproducibility and security.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/concepts/projects/build.md#_snippet_1

LANGUAGE: text
CODE:
```
setuptools==68.2.2 --hash=sha256:b454a35605876da60632df1a60f736524eb73cc47bbc9f3f1ef1b644de74fd2a
```

----------------------------------------

TITLE: Execute Library Function using uv run
DESCRIPTION: Shows how to navigate into the library project directory and execute the defined API function using `uv run python -c`. This command imports the library and calls its `hello()` function, printing the result to the console.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/concepts/projects/init.md#_snippet_13

LANGUAGE: console
CODE:
```
$ cd example-lib
$ uv run python -c "import example_lib; print(example_lib.hello())"
Hello from example-lib!
```

----------------------------------------

TITLE: Python requirements.txt File Example
DESCRIPTION: This snippet illustrates the common syntax used in a `requirements.txt` file for Python projects. It includes examples of exact version pinning (inflection), minimum version (upsidedown), unpinned dependencies (numpy), and dependencies with extras and version ranges (pandas[tabulate]).
SOURCE: https://github.com/astral-sh/uv/blob/main/crates/uv-requirements-txt/test-data/requirements-txt/for-poetry.txt#_snippet_0

LANGUAGE: Python
CODE:
```
inflection==0.5.1
upsidedown==0.4
numpy
pandas[tabulate]>=1,<2
```

----------------------------------------

TITLE: Reproducible Example with uv Bash Script
DESCRIPTION: This bash script presents a sequence of uv commands (init, add, sync, run) to create a minimal reproducible example for bug reporting. It's ideal for demonstrating platform-specific issues and should be accompanied by verbose logs and system information.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/troubleshooting/reproducible-examples.md#_snippet_5

LANGUAGE: bash
CODE:
```
uv init
uv add pydantic
uv sync
uv run -v python -c "import pydantic"
```

----------------------------------------

TITLE: Initialize Projects with `uv init`
DESCRIPTION: The `uv init` command facilitates the setup of new `uv` projects. Recent updates include the removal of a redundant alias for cleaner CLI usage and the addition of an optional `--description` flag, allowing users to provide a project description during initialization.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.5.x.md#_snippet_5

LANGUAGE: CLI
CODE:
```
uv init [--description <text>]
```

----------------------------------------

TITLE: uv Command-Line Parameters and Environment Variables
DESCRIPTION: Documentation for various configuration options available in `uv`, including command-line arguments for `uv pip compile`, environment variables for HTTP timeouts, and settings for `pyvenv.cfg` during virtual environment creation.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.1.x.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
uv pip compile --annotation-style <style>
  - Description: Specifies the annotation style for `uv pip compile` output.
  - Parameter:
    - <style>: The desired annotation style (e.g., 'compact', 'full').

Environment Variables:
  UV_HTTP_TIMEOUT=<seconds>
    - Description: Sets the HTTP request timeout for `uv` operations.
    - Type: Integer (seconds)
  HTTP_TIMEOUT=<seconds>
    - Description: Sets the HTTP request timeout for `uv` operations (alternative to UV_HTTP_TIMEOUT).
    - Type: Integer (seconds)

pyvenv.cfg Configuration:
  - Description: Allows passing extra key-value pairs for `pyvenv.cfg` when creating a virtual environment.
  - Usage: Specific key-value pairs are passed during venv creation to customize the environment.
```

----------------------------------------

TITLE: Create new GitHub repository with gh CLI
DESCRIPTION: Demonstrates how to quickly create a new GitHub repository using the `gh` command-line interface. The `--clone` flag ensures that the repository is cloned locally immediately after creation, streamlining the setup process for a new reproduction.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/troubleshooting/reproducible-examples.md#_snippet_7

LANGUAGE: console
CODE:
```
$ gh repo create uv-mre-1234 --clone
```

----------------------------------------

TITLE: Configure uv pip behavior via pyproject.toml or uv.toml
DESCRIPTION: Comprehensive documentation for all `uv pip` configuration options, including their purpose, default values, types, and example usage in both `pyproject.toml` and `uv.toml`.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_102

LANGUAGE: APIDOC
CODE:
```
no-extra:
  Description: Exclude the specified optional dependencies if `all-extras` is supplied.
  Default: []
  Type: list[str]
  Example (pyproject.toml):
    [tool.uv.pip]
    all-extras = true
    no-extra = ["dev", "docs"]
  Example (uv.toml):
    [pip]
    all-extras = true
    no-extra = ["dev", "docs"]

no-header:
  Description: Exclude the comment header at the top of output file generated by `uv pip compile`.
  Default: false
  Type: bool
  Example (pyproject.toml):
    [tool.uv.pip]
    no-header = true
  Example (uv.toml):
    [pip]
    no-header = true

no-index:
  Description: Ignore all registry indexes (e.g., PyPI), instead relying on direct URL dependencies and those provided via `--find-links`.
  Default: false
  Type: bool
  Example (pyproject.toml):
    [tool.uv.pip]
    no-index = true
  Example (uv.toml):
    [pip]
    no-index = true

no-sources:
  Description: Ignore the `tool.uv.sources` table when resolving dependencies. Used to lock against the standards-compliant, publishable package metadata, as opposed to using any local or Git sources.
  Default: false
  Type: bool
  Example (pyproject.toml):
    [tool.uv.pip]
    no-sources = true
  Example (uv.toml):
    [pip]
    no-sources = true

no-strip-extras:
  Description: Include extras in the output file. By default, uv strips extras, as any packages pulled in by the extras are already included as dependencies in the output file directly. Further, output files generated with `--no-strip-extras` cannot be used as constraints files in `install` and `sync` invocations.
  Default: false
  Type: bool
  Example (pyproject.toml):
    [tool.uv.pip]
    no-strip-extras = true
  Example (uv.toml):
    [pip]
    no-strip-extras = true

no-strip-markers:
  Description: Include environment markers in the output file generated by `uv pip compile`. By default, uv strips environment markers, as the resolution generated by `compile` is only guaranteed to be correct for the target environment.
  Default: false
  Type: bool
  Example (pyproject.toml):
    [tool.uv.pip]
    no-strip-markers = true
  Example (uv.toml):
    [pip]
    no-strip-markers = true

only-binary:
  Description: Only use pre-built wheels; don't build source distributions. When enabled, resolving will not run code from the given packages. The cached wheels of already-built source distributions will be reused, but operations that require building distributions will exit with an error. Multiple packages may be provided. Disable binaries for all packages with `:all:`. Clear previously specified packages with `:none:`.
  Default: []
  Type: list[str]
  Example (pyproject.toml):
    [tool.uv.pip]
    only-binary = ["ruff"]
  Example (uv.toml):
    [pip]
    only-binary = ["ruff"]

output-file:
  Description: Write the requirements generated by `uv pip compile` to the given `requirements.txt` file. If the file already exists, the existing versions will be preferred when resolving dependencies, unless `--upgrade` is also specified.
  Default: None
  Type: str
  Example (pyproject.toml):
    [tool.uv.pip]
    output-file = "requirements.txt"
  Example (uv.toml):
    [pip]
    output-file = "requirements.txt"

prefix:
  Description: Install packages into `lib`, `bin`, and other top-level folders under the specified directory, as if a virtual environment were present at that location. In general, prefer the use of `--python` to install into an alternate environment, as scripts and other artifacts installed via `--prefix` will reference the installing interpreter, rather than any interpreter added to the `--prefix` directory, rendering them non-portable.
  Default: None
  Type: str
  Example (pyproject.toml):
    [tool.uv.pip]
    prefix = "./prefix"
  Example (uv.toml):
    [pip]
    prefix = "./prefix"
```

----------------------------------------

TITLE: Manage Python projects with uv
DESCRIPTION: This example demonstrates the core workflow for managing Python projects using `uv`, including initializing a new project, adding dependencies, running project-specific scripts, and synchronizing the environment with a lockfile.
SOURCE: https://github.com/astral-sh/uv/blob/main/README.md#_snippet_5

LANGUAGE: console
CODE:
```
$ uv init example
Initialized project `example` at `/home/user/example`

$ cd example

$ uv add ruff
Creating virtual environment at: .venv
Resolved 2 packages in 170ms
   Built example @ file:///home/user/example
Prepared 2 packages in 627ms
Installed 2 packages in 1ms
 + example==0.1.0 (from file:///home/user/example)
 + ruff==0.5.0

$ uv run ruff check
All checks passed!

$ uv lock
Resolved 2 packages in 0.33ms

$ uv sync
Resolved 2 packages in 0.70ms
Audited 1 package in 0.02ms
```

----------------------------------------

TITLE: Initialize Bare Project with Additional Metadata using uv
DESCRIPTION: Demonstrates how to use `uv init --bare` while still opting in to include additional metadata. This example shows how to add a description, author information from Git, initialize Git VCS, and pin the Python version using specific command-line flags.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/concepts/projects/init.md#_snippet_22

LANGUAGE: console
CODE:
```
$ uv init example --bare --description "Hello world" --author-from git --vcs git --python-pin
```

----------------------------------------

TITLE: Generating Verbose Docker Build Logs
DESCRIPTION: This console command provides a method to build a Docker image with verbose output, disabling caching and fancy progress indicators. This is particularly useful for debugging build issues and capturing complete logs for sharing in reproducible examples.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/troubleshooting/reproducible-examples.md#_snippet_4

LANGUAGE: bash
CODE:
```
docker build . --progress plain --no-cache
```

----------------------------------------

TITLE: Example AWS Lambda Proxy Integration Response
DESCRIPTION: An example JSON structure representing a typical response from an AWS Lambda function configured for proxy integration, including headers, body, and encoding status. This demonstrates the expected output format for Lambda functions.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/integration/aws-lambda.md#_snippet_10

LANGUAGE: json
CODE:
```
{
  "content-type": "application/json"
},
"multiValueHeaders": {},
"body": "\"Hello, world!\"",
"isBase64Encoded": false
}
```

----------------------------------------

TITLE: Configure Build Metadata with `uv-build`
DESCRIPTION: The `uv-build` process now includes extras in `Requires-Dist` metadata, improving the accuracy of dependency resolution for packages with optional components. This enhancement ensures that build backends correctly identify and manage all necessary dependencies during the build process.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.5.x.md#_snippet_3

LANGUAGE: CLI
CODE:
```
uv-build
```

----------------------------------------

TITLE: Manage Python Installations with `uv python install`
DESCRIPTION: The `uv python install` command is used to manage Python environments and package installations. Recent updates include the `--preview` flag for accessing experimental features and the `--default` flag to address issues with multiple installation requests, ensuring more robust and predictable behavior.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.5.x.md#_snippet_1

LANGUAGE: CLI
CODE:
```
uv python install --preview
uv python install --default
```

----------------------------------------

TITLE: uv Script Management Commands (PEP 723)
DESCRIPTION: Documentation for `uv` commands related to managing Python scripts with inline metadata (PEP 723), including lockfile generation and usage across various operations like running, adding/removing dependencies, exporting, and viewing dependency trees.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.5.x.md#_snippet_8

LANGUAGE: APIDOC
CODE:
```
uv lock --script /path/to/script.py
  - Locks a Python script based on its inline metadata (PEP 723).
  - Generates a lockfile (e.g., `script.py.lock`) adjacent to the script.
  - Parameters:
    - --script /path/to/script.py: Specifies the path to the Python script to lock.

uv run --script /path/to/script.py
  - Executes a Python script, respecting its associated lockfile.
  - The lockfile will be updated if necessary.

uv add --script /path/to/script.py <requirements>
  - Adds dependencies to a Python script, respecting and updating its lockfile.

uv remove --script /path/to/script.py <requirements>
  - Removes dependencies from a Python script, respecting and updating its lockfile.

uv export --script /path/to/script.py
  - Exports the dependencies of a Python script, supporting scripts with or without lockfiles.

uv tree --script /path/to/script.py
  - Displays the dependency tree for a Python script, supporting scripts with or without lockfiles.
```

----------------------------------------

TITLE: Serve Documentation Locally with MkDocs
DESCRIPTION: These commands allow users to serve the project documentation locally using MkDocs. There are two variations: one for general contributors using public requirements and another for Astral organization members with access to insider documentation via specific requirements.
SOURCE: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md#_snippet_11

LANGUAGE: shell
CODE:
```
uvx --with-requirements docs/requirements.txt -- mkdocs serve -f mkdocs.public.yml
```

LANGUAGE: shell
CODE:
```
uvx --with-requirements docs/requirements-insiders.txt -- mkdocs serve -f mkdocs.insiders.yml
```

----------------------------------------

TITLE: Example: uv add-bounds in pyproject.toml
DESCRIPTION: Example configuration for setting the 'add-bounds' option to 'major' within a pyproject.toml file. This ensures that new dependencies are added with a constraint allowing the same major version.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_19

LANGUAGE: toml
CODE:
```
[tool.uv]
add-bounds = "major"
```

----------------------------------------

TITLE: Example: uv add-bounds in uv.toml
DESCRIPTION: Example configuration for setting the 'add-bounds' option to 'major' within a uv.toml file. This provides an alternative way to configure the default version bounding for dependencies.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_20

LANGUAGE: toml
CODE:
```
add-bounds = "major"
```

----------------------------------------

TITLE: Example: uv allow-insecure-host in pyproject.toml
DESCRIPTION: Example configuration for allowing insecure connections to 'localhost:8080' within a pyproject.toml file. This is useful for development environments where self-signed certificates might be used.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_22

LANGUAGE: toml
CODE:
```
[tool.uv]
allow-insecure-host = ["localhost:8080"]
```

----------------------------------------

TITLE: Example: uv cache-dir in pyproject.toml
DESCRIPTION: Example configuration for setting the uv cache directory to './.uv_cache' within a pyproject.toml file. This allows for project-specific cache management.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_25

LANGUAGE: toml
CODE:
```
[tool.uv]
cache-dir = "./.uv_cache"
```

----------------------------------------

TITLE: Example: uv allow-insecure-host in uv.toml
DESCRIPTION: Example configuration for allowing insecure connections to 'localhost:8080' within a uv.toml file. This provides an alternative configuration method for allowing insecure hosts.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_23

LANGUAGE: toml
CODE:
```
allow-insecure-host = ["localhost:8080"]
```

----------------------------------------

TITLE: Include Data Files in `uv_build` Backend
DESCRIPTION: Example `pyproject.toml` snippet demonstrating how to configure the `uv_build` backend to include custom data files, such as headers and scripts, in the generated wheel.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_14

LANGUAGE: toml
CODE:
```
[tool.uv.build-backend]
data = { "headers": "include/headers", "scripts": "bin" }
```

----------------------------------------

TITLE: uv CLI Commands and Environment Variables Reference
DESCRIPTION: This section details various command-line interface (CLI) arguments and environment variables available in the uv tool, including their purpose and usage. It covers options for dependency management, Python environment interaction, and configuration.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.1.x.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
CLI Commands:

  uv pip --python <path>
    - Description: Allows specifying a virtual environment path for `uv pip` commands.
    - Parameters:
      - <path>: The path to the virtual environment.

  uv pip list --outdated
    - Description: Adds compatibility for listing outdated packages.

  uv <command> --help
    - Description: Enables auto-wrapping of help output for `uv` commands.

  uv <command> --require-hashes
    - Description: Displays the `--require-hashes` argument in help output.

  uv pip compile --python
    - Description: Allows specifying a Python interpreter for `pip compile`.

  uv pip compile --system
    - Description: Allows using the system Python for `pip compile`.

  uv <command> --no-cache
    - Description: Related to cache control; its `Option<bool>` behavior has been removed.

  uv <command> --compile
    - Description: Compiles bytecode. This argument has been renamed.

  uv <command> --compile-bytecode
    - Description: Compiles bytecode. This is the new name for `--compile`.

  uv <command> --python-platform <platform>
    - Description: Enables resolving against a specific target platform.
    - Parameters:
      - <platform>: The target platform identifier.

  uv <command> --constraint <file>
    - Description: Specifies a constraint file for dependency resolution. Its value can also be provided via the `UV_CONSTRAINT` environment variable.
    - Parameters:
      - <file>: Path to the constraint file.

  uv <command> --no-deps
    - Description: Controls dependency resolution behavior, e.g., avoids fetching metadata for editables and restricts observed requirements to direct dependencies.

  uv <command> --emit-index-annotation
    - Description: Hides sensitive password information when printing index annotations.

  uv <command> --<negation-flag>
    - Description: Supports general negation flags (e.g., `--no-foo`) across the CLI.

Environment Variables:

  UV_REQUIRE_HASHES
    - Description: An environment variable to set the `--require-hashes` behavior.
    - Values: Boolean (e.g., `true`, `false`, `0`, `1`).

  UV_SYSTEM_PYTHON
    - Description: A boolean environment variable to control the usage of the system Python.
    - Values: Boolean (e.g., `true`, `false`, `0`, `1`).

  UV_CONSTRAINT
    - Description: An environment variable to provide a value for the `--constraint` CLI argument.
    - Values: Path to a constraint file.
```

----------------------------------------

TITLE: Add Dependencies with `uv add`
DESCRIPTION: The `uv add` command is used to incorporate new dependencies into a project. A recent fix addresses an issue where providing subdirectories in direct URLs would cause errors, making the command more resilient and user-friendly when specifying package locations.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.5.x.md#_snippet_4

LANGUAGE: CLI
CODE:
```
uv add <package_specifier> [subdirectory_path]
```

----------------------------------------

TITLE: Specifying Platform for uv Docker Image
DESCRIPTION: This Dockerfile snippet illustrates how to explicitly set the target platform (e.g., linux/amd64) when building a Docker image. This ensures that the reproducible example behaves consistently across different system architectures, preventing platform-specific issues.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/troubleshooting/reproducible-examples.md#_snippet_1

LANGUAGE: Dockerfile
CODE:
```
FROM --platform=linux/amd64 ghcr.io/astral-sh/uv:0.5.24-debian-slim
```

----------------------------------------

TITLE: Export Dependencies with `uv export`
DESCRIPTION: The `uv export` command allows users to generate a list of installed dependencies. A recent enhancement enables this command to support non-project workspaces, providing greater flexibility for dependency management across various project structures.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.5.x.md#_snippet_2

LANGUAGE: CLI
CODE:
```
uv export
```

----------------------------------------

TITLE: Example: uv cache-dir in uv.toml
DESCRIPTION: Example configuration for setting the uv cache directory to './.uv_cache' within a uv.toml file. This provides an alternative, global or user-level configuration for the cache location.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_26

LANGUAGE: toml
CODE:
```
cache-dir = "./.uv_cache"
```

----------------------------------------

TITLE: Clone and checkout Git repository for reproduction
DESCRIPTION: Provides a sequence of console commands to clone a Git repository, change the current directory to the project, checkout a specific commit, and then execute commands to reproduce an error. This is essential for creating reproducible bug reports.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/troubleshooting/reproducible-examples.md#_snippet_6

LANGUAGE: console
CODE:
```
$ git clone https://github.com/<user>/<project>.git
$ cd <project>
$ git checkout <commit>
$ <commands to produce error>
```

----------------------------------------

TITLE: Manage Python Tools with uv
DESCRIPTION: Commands for running and installing Python tools published to package indexes like PyPI. This includes temporary execution, user-wide installation, and managing tool executables in the shell path.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/getting-started/features.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
uvx / uv tool run
  - Run a tool in a temporary environment.
uv tool install
  - Install a tool user-wide.
uv tool uninstall
  - Uninstall a tool.
uv tool list
  - List installed tools.
uv tool update-shell
  - Update the shell to include tool executables.
```

----------------------------------------

TITLE: Partial pyproject.toml example for CPU-only PyTorch with uv
DESCRIPTION: This `pyproject.toml` snippet provides a partial example of configuring `uv` to use CPU-only PyTorch builds. It illustrates how to define project metadata, dependencies, and map `torch` and `torchvision` to a custom `pytorch-cpu` index.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/integration/pytorch.md#_snippet_3

LANGUAGE: TOML
CODE:
```
[project]
name = "project"
version = "0.1.0"
requires-python = ">=3.12.0"
dependencies = [
  "torch>=2.7.0",
  "torchvision>=0.22.0",
]

[tool.uv.sources]
torch = [
    { index = "pytorch-cpu" },
]
torchvision = [
```

----------------------------------------

TITLE: Reference for `tool.uv` Configuration in `pyproject.toml`
DESCRIPTION: Comprehensive documentation for all `uv` project configuration options available under the `[tool.uv]` section in `pyproject.toml`, including project type, environment requirements, dependency sources, and build backend settings.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
package:
  Description: Whether the project should be considered a Python package, or a non-package ("virtual") project. Packages are built and installed in editable mode, requiring a build backend. Virtual projects are not built or installed; only their dependencies are included. Creating a package requires a 'build-system' in 'pyproject.toml' and adherence to the build backend's structure.
  Default value: true
  Type: bool

required-environments:
  Description: A list of required platforms for packages without source distributions. Ensures the resolution contains wheels for specific platforms or fails if none are available. Expands the set of platforms 'uv' must support, unlike 'environments' which limits it.
  Default value: []
  Type: str | list[str]

sources:
  Description: The sources to use when resolving dependencies. Enriches dependency metadata with additional sources (Git repository, URL, local path, or an alternative registry) during development.
  Default value: {}
  Type: dict

build-backend:
  Description: Settings for the 'uv_build' backend. These settings only apply when using the 'uv_build' backend; other build backends have their own configuration. All options accepting globs use portable glob patterns from PEP 639.

  data:
    Description: Data includes for wheels. Each entry is a directory whose contents are copied to the matching directory in the wheel. Upon installation, this data is moved to its target location. Small data files are usually included by placing them in the Python module instead of using data includes.
    Default value: {}
    Type: dict[str, str]
    Sub-options:
      scripts: Installed to the directory for executables ('<venv>/bin' on Unix or '<venv>\Scripts' on Windows). This directory is added to 'PATH' when the virtual environment is activated or when using 'uv run'. Can be used to install additional binaries. Consider 'project.scripts' for Python entrypoints.
      data: Installed over the virtualenv environment root. Warning: This may override existing files!
      headers: Installed to the include directory. Compilers building Python packages with this package as a build requirement use the include directory to find additional header files.
      purelib and platlib: Installed to the 'site-packages' directory. Not recommended to use these two options.
```

----------------------------------------

TITLE: Example of requirements.txt from pip freeze
DESCRIPTION: Content of a `requirements.txt` file generated by `pip freeze`, showing exact version pins for all installed packages without comments or dependency origins.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/migration/pip-to-project.md#_snippet_9

LANGUAGE: python
CODE:
```
annotated-types==0.7.0
anyio==4.8.0
fastapi==0.115.11
idna==3.10
pydantic==2.10.6
pydantic-core==2.27.2
sniffio==1.3.1
starlette==0.46.1
typing-extensions==4.12.2
```

----------------------------------------

TITLE: Python `manylinux_compatible` Function Example
DESCRIPTION: This Python code snippet provides an example implementation of a `manylinux_compatible` function, as specified by PEP 600. It demonstrates how a Python distributor might define this function to explicitly indicate non-compatibility with `manylinux` standards, influencing how tools like `uv` handle package installations.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/pip/compatibility.md#_snippet_5

LANGUAGE: python
CODE:
```
from __future__ import annotations
manylinux1_compatible = False
manylinux2010_compatible = False
manylinux2014_compatible = False


def manylinux_compatible(*_, **__):  # PEP 600
    return False
```

----------------------------------------

TITLE: uv python and uv venv Environment Management
DESCRIPTION: Addresses improvements and fixes related to Python environment listing and virtual environment creation, guiding users towards the recommended `uv venv` command.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.4.x.md#_snippet_12

LANGUAGE: APIDOC
CODE:
```
uv python list
  - Description: Lists available Python versions.
  - Behavior: Avoids panicking when encountering an invalid Python version.

uv venv
  - Description: Creates a virtual environment.
  - Usage: Users are now directed towards `uv venv` for virtual environment creation.
```

----------------------------------------

TITLE: Analyze uv-dev Concurrency with `tracing-durations-export`
DESCRIPTION: Enables tracing-durations-export for the `uv-dev` binary to visualize parallel requests and identify CPU-bound sections. The trace data is saved to a specified NDJSON file.
SOURCE: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md#_snippet_9

LANGUAGE: shell
CODE:
```
RUST_LOG=uv=info TRACING_DURATIONS_FILE=target/traces/jupyter.ndjson cargo run --features tracing-durations-export --bin uv-dev --profile profiling -- resolve jupyter
```

----------------------------------------

TITLE: uv init Project Initialization Enhancements
DESCRIPTION: Describes updates to the `uv init` command, including support for type hints in generated code, improved error messages, and `py.typed` file creation when initializing a library.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.4.x.md#_snippet_13

LANGUAGE: APIDOC
CODE:
```
uv init [--lib]
  - Description: Initializes a new project.
  - Behavior:
    - Uses type hints in generated code.
    - Improves error messages for already initialized projects.
    - Creates `py.typed` files when `--lib` is used.
```

----------------------------------------

TITLE: Configure uv Package Indexes in pyproject.toml
DESCRIPTION: This configuration demonstrates how to define named package indexes in `pyproject.toml` for `uv`, pin specific packages to these indexes, and mark indexes as explicit. The first example shows a basic named index definition. The second illustrates how to pin a package (`torch`) to this named index. The third example extends this by marking the index as `explicit`, meaning packages will only be installed from it if explicitly pinned.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.4.x.md#_snippet_27

LANGUAGE: toml
CODE:
```
[[tool.uv.index]]
name = "pytorch"
url = "https://download.pytorch.org/whl/cpu"
```

LANGUAGE: toml
CODE:
```
[tool.uv.sources]
torch = { index = "pytorch" }

[[tool.uv.index]]
name = "pytorch"
url = "https://download.pytorch.org/whl/cpu"
```

LANGUAGE: toml
CODE:
```
[tool.uv.sources]
torch = { index = "pytorch" }

[[tool.uv.index]]
name = "pytorch"
url = "https://download.pytorch.org/whl/cpu"
explicit = true
```

----------------------------------------

TITLE: Displaying Comprehensive Help Menus for uv Commands
DESCRIPTION: Utilize the `uv help` command to access a more detailed and potentially paginated help menu for the main `uv` tool or any specific subcommand, providing extensive information on options and usage.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/getting-started/help.md#_snippet_1

LANGUAGE: console
CODE:
```
$ uv help
```

LANGUAGE: console
CODE:
```
$ uv help init
```

----------------------------------------

TITLE: Benchmark uv Resolver Performance
DESCRIPTION: Demonstrates how to use the `scripts/benchmark` utility to benchmark the uv resolver against predefined workloads, comparing its performance with other tools or different uv versions.
SOURCE: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md#_snippet_7

LANGUAGE: shell
CODE:
```
uv run resolver \
    --uv-pip \
    --poetry \
    --benchmark \
    resolve-cold \
    ../scripts/requirements/trio.in
```

----------------------------------------

TITLE: Testing Python Package Installation with uv run
DESCRIPTION: This section describes how to verify the installation and importability of a Python package using the `uv run` command. It explains the purpose of the `--no-project` flag to ensure testing against an installed version and the `--refresh-package` option to avoid cached versions during testing.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/package.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
uv run --with <PACKAGE> --no-project -- python -c "import <PACKAGE>"
  - Executes a command within a uv-managed environment, primarily used for testing package installation and importability.
  - Parameters:
    - --with <PACKAGE>: Specifies the package to be made available in the execution environment.
    - --no-project: Prevents `uv` from installing the package from the current local project directory, ensuring the test uses an installed version.
    - --refresh-package <PACKAGE>: Forces `uv` to refresh the specified package, bypassing any cached versions. Useful when testing recently updated packages.
  - Usage:
    - Typically used to verify that a package can be successfully installed and imported after publishing or building.
```

LANGUAGE: console
CODE:
```
$ uv run --with <PACKAGE> --no-project -- python -c "import <PACKAGE>"
```

----------------------------------------

TITLE: Example: Specify find-links locations for uv pip
DESCRIPTION: Demonstrates how to provide additional locations for `uv pip` to search for candidate distributions by setting `find-links` in `pyproject.toml` or `uv.toml`.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_86

LANGUAGE: toml
CODE:
```
[tool.uv.pip]
find-links = ["https://download.pytorch.org/whl/torch_stable.html"]
```

LANGUAGE: toml
CODE:
```
[pip]
find-links = ["https://download.pytorch.org/whl/torch_stable.html"]
```

----------------------------------------

TITLE: Analyze uv Concurrency with `tracing-durations-export`
DESCRIPTION: Enables tracing-durations-export for the `uv` binary to visualize parallel requests and identify CPU-bound sections. The trace data is saved to a specified NDJSON file.
SOURCE: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md#_snippet_8

LANGUAGE: shell
CODE:
```
RUST_LOG=uv=info TRACING_DURATIONS_FILE=target/traces/jupyter.ndjson cargo run --features tracing-durations-export --profile profiling -- pip compile scripts/requirements/jupyter.in
```

----------------------------------------

TITLE: Configure require-hashes in pyproject.toml and uv.toml
DESCRIPTION: Example usage demonstrating how to enable the `require-hashes` option in `uv`'s configuration files, ensuring all package requirements have corresponding hashes.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_110

LANGUAGE: toml
CODE:
```
[tool.uv.pip]
require-hashes = true
```

LANGUAGE: toml
CODE:
```
[pip]
require-hashes = true
```

----------------------------------------

TITLE: Example: Include optional dependencies (extras) in uv pip
DESCRIPTION: Demonstrates how to include optional dependencies from specified extras when resolving packages by setting the `extra` option in `pyproject.toml` or `uv.toml`.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_84

LANGUAGE: toml
CODE:
```
[tool.uv.pip]
extra = ["dev", "docs"]
```

LANGUAGE: toml
CODE:
```
[pip]
extra = ["dev", "docs"]
```

----------------------------------------

TITLE: Example of platform-specific requirements file
DESCRIPTION: Illustrates a `requirements.txt` file containing platform-specific dependencies, such as `colorama` for Windows, before uv's marker transformation. This format lacks explicit environment markers.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/migration/pip-to-project.md#_snippet_23

LANGUAGE: python
CODE:
```
colorama==0.4.6
    # via tqdm
tqdm==4.67.1
    # via -r requirements.in
```

----------------------------------------

TITLE: uv CLI Command Options and Configuration
DESCRIPTION: Documentation for various command-line options and configuration file usage in the uv tool, primarily affecting package synchronization, installation, and virtual environment management. These options provide fine-grained control over uv's behavior.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.1.x.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
uv sync/install --python-platform <platform_tag>
  - Specifies the target Python platform for package resolution.
  - Supports alternate manylinux targets.
  - Example: uv sync --python-platform manylinux_2_17_x86_64

uv sync/install --target <path>
  - Specifies the installation target directory for packages.

uv --index-strategy unsafe-best-match
  - Implements an unsafe best-match strategy for index resolution.

uv --allow-existing
  - Allows overwriting an existing virtual environment during creation or update.

uv --no-upgrade
  - Prevents package upgrades during operations.

uv --no-refresh
  - Prevents refreshing package metadata during operations.

uv --color <mode>
  - Controls color output in the CLI.

uv.toml
  - Configuration file for uv, searched in directories for project-specific settings.
```

----------------------------------------

TITLE: Rust Extension Module Function for Python Integration
DESCRIPTION: Illustrates a simple Rust function defined in `src/lib.rs` that is exposed to Python via `pyo3`. This example demonstrates how to create a callable function from Rust, making it accessible within the Python environment.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/concepts/projects/init.md#_snippet_16

LANGUAGE: rust
CODE:
```
use pyo3::prelude::*;

#[pyfunction]
fn hello_from_bin() -> String {
    "Hello from example-ext!".to_string()
}

#[pymodule]
fn _core(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(hello_from_bin, m)?)?;
    Ok(())
}
```

----------------------------------------

TITLE: Configure uv pip no-build in TOML
DESCRIPTION: Example configurations for setting the `no-build` option, which prevents building source distributions, in `pyproject.toml` and `uv.toml`.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/reference/settings.md#_snippet_97

LANGUAGE: toml
CODE:
```
[tool.uv.pip]
no-build = true
```

LANGUAGE: toml
CODE:
```
[pip]
no-build = true
```

----------------------------------------

TITLE: Generate uv JSON Schema
DESCRIPTION: Runs the `cargo dev generate-json-schema` command to update the JSON Schema if tests fail due to a mismatch, ensuring consistency.
SOURCE: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md#_snippet_1

LANGUAGE: shell
CODE:
```
cargo dev generate-json-schema
```

----------------------------------------

TITLE: Example of a Compiled requirements.txt File
DESCRIPTION: Content of a `requirements.txt` file generated by `pip-compile` (or `uv pip compile`), showing exact version pins for all direct and transitive dependencies, along with their origins.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/guides/migration/pip-to-project.md#_snippet_7

LANGUAGE: python
CODE:
```
annotated-types==0.7.0
    # via pydantic
anyio==4.8.0
    # via starlette
fastapi==0.115.11
    # via -r requirements.in
idna==3.10
    # via anyio
pydantic==2.10.6
    # via
    #   -r requirements.in
    #   fastapi
pydantic-core==2.27.2
    # via pydantic
sniffio==1.3.1
    # via anyio
starlette==0.46.1
    # via fastapi
typing-extensions==4.12.2
    # via
    #   fastapi
    #   pydantic
    #   pydantic-core
```

----------------------------------------

TITLE: Displaying Condensed Help Menus for uv Commands
DESCRIPTION: Use the `--help` flag to quickly view a concise help menu for the main `uv` command or any specific subcommand, listing available options and basic usage.
SOURCE: https://github.com/astral-sh/uv/blob/main/docs/getting-started/help.md#_snippet_0

LANGUAGE: console
CODE:
```
$ uv --help
```

LANGUAGE: console
CODE:
```
$ uv init --help
```

----------------------------------------

TITLE: uv init Command Enhancements
DESCRIPTION: Describes new functionalities for the `uv init` command, such as support for script-based initialization, automatic Git repository setup, and updating the `--package` command to match the project name.
SOURCE: https://github.com/astral-sh/uv/blob/main/changelogs/0.4.x.md#_snippet_20

LANGUAGE: APIDOC
CODE:
```
uv init --script
  - Supports initialization with a script.
uv init (Git repository)
  - Initializes a Git repository.
uv init --package <project_name>
  - Updates the command to match the project name.
```