TITLE: Initializing a Taskfile using Task CLI - Shell
DESCRIPTION: This snippet demonstrates how to initialize a new Taskfile in your current directory using the Task CLI with the --init flag. No dependencies are necessary other than having Task installed. The output is the creation of a Taskfile.yml in the working directory. This command is the standard starting point for all Task-based automation.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/getting_started.mdx#_snippet_0

LANGUAGE: shell
CODE:
```
task --init

```

----------------------------------------

TITLE: Basic Taskfile Structure with Variable and Default Task - YAML
DESCRIPTION: This YAML snippet presents a minimal Taskfile structure defining a variable and a default task. It specifies the file version, declares a "GREETING" variable, and implements a default task that echoes the variable's value. The silent flag suppresses task metadata output, ensuring only command results are shown. This example is fully self-contained, with no external dependencies.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/getting_started.mdx#_snippet_3

LANGUAGE: yaml
CODE:
```
version: '3'

vars:
  GREETING: Hello, World!

tasks:
  default:
    cmds:
      - echo "{{.GREETING}}"
    silent: true

```

----------------------------------------

TITLE: Executing Task CLI Commands (Shell)
DESCRIPTION: Illustrates the basic command syntax for the Task CLI. It shows how to invoke the `task` command, optionally followed by flags, a list of tasks to execute, and potentially additional arguments (prefixed with `--`) to be passed to the tasks via the `CLI_ARGS` variable.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/reference/cli.mdx#_snippet_0

LANGUAGE: shell
CODE:
```
task [--flags] [tasks...] [-- CLI_ARGS...]
```

----------------------------------------

TITLE: Invoking Task with Flags and Arguments in Shell
DESCRIPTION: Demonstrates the general syntax for running Task commands in a shell environment. This includes support for flag arguments before and after tasks, as well as the special use of '--' to pass remaining parameters as CLI_ARGS. Designed as a baseline for users to understand Task command invocation, no dependencies are required beyond having Task installed. Requires the user to replace '[--flags]', '[tasks...]', and 'CLI_ARGS...' with appropriate flags, one or more task names, and optional CLI arguments as needed. The command expects various flags and tasks depending on the desired operation. Outputs and behaviors differ based on flags and inputs provided.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/reference/cli.mdx#_snippet_0

LANGUAGE: shell
CODE:
```
task [--flags] [tasks...] [-- CLI_ARGS...]
```

----------------------------------------

TITLE: Defining Platform-Specific Tasks in Taskfile YAML
DESCRIPTION: These snippets illustrate restricting task or command execution to specific operating systems and architectures using the 'platforms' key with valid GOOS and GOARCH values. Tasks define arrays like [windows], [windows/amd64], or multiple platforms concurrently, and commands within tasks can also have platform-specific restrictions, enabling cross-platform build pipelines with conditional execution. Inputs are platform lists; outputs are conditional task or command runs based on detected platform.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_6

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build-windows:
    platforms: [windows]
    cmds:
      - echo 'Running command on Windows'
```

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build-windows-amd64:
    platforms: [windows/amd64]
    cmds:
      - echo 'Running command on Windows (amd64)'
```

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build-amd64:
    platforms: [amd64]
    cmds:
      - echo 'Running command on amd64'
```

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:
    platforms: [windows/amd64, darwin]
    cmds:
      - echo 'Running command on Windows (amd64) and macOS'
```

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:
    cmds:
      - cmd: echo 'Running command on Windows (amd64) and macOS'
        platforms: [windows/amd64, darwin]
      - cmd: echo 'Running on all platforms'
```

----------------------------------------

TITLE: Defining Multi-Command Tasks with go-task in YAML
DESCRIPTION: This snippet provides an example of defining a task with multiple sequential commands using the 'cmds' array property in go-task's YAML format. Each string in the array represents a shell command to be run in sequence within a single task execution. The only dependency is the go-task runner, and the expected input is a list of commands; outputs are each command executed in order. Suitable for grouping related automation steps under one task.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/reference/schema.mdx#_snippet_4

LANGUAGE: yaml
CODE:
```
tasks:
  foo:
    cmds:
      - echo "foo"
      - echo "bar"

```

----------------------------------------

TITLE: Defining Task Dependencies for Parallel Execution in Taskfile YAML
DESCRIPTION: This snippet shows how to configure tasks with dependencies using the 'deps' key in Taskfile version 3. Dependencies listed under 'deps' run automatically before the parent task's commands, executing in parallel to optimize performance. A parent task can depend on multiple tasks or combine dependencies without commands, forming grouped task executions. This is useful to express build pipelines and grouped work. Input consists of named tasks and dependency arrays; output is automatically ordered task execution.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_3

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:
    deps: [assets]
    cmds:
      - go build -v -i main.go

  assets:
    cmds:
      - esbuild --bundle --minify css/index.css > public/bundle.css
```

----------------------------------------

TITLE: Installing Task CLI using the official install script - Shell
DESCRIPTION: Installs Task CLI by downloading from an official install script via curl. Supports default installation to ./bin directory, or custom directory via -b flag. Can specify version tag to install specific releases. Useful for CI and scripting environments.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/installation.mdx#_snippet_10

LANGUAGE: shell
CODE:
```
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d
```

LANGUAGE: shell
CODE:
```
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin
```

LANGUAGE: shell
CODE:
```
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d v3.36.0
```

LANGUAGE: shell
CODE:
```
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin v3.42.1
```

----------------------------------------

TITLE: Calling a Task - Shell
DESCRIPTION: This command executes a specific task named `default` by using the `task` command followed by the task name. It assumes that a Taskfile exists in the current directory or is accessible through a command-line argument. It utilizes the Task CLI directly. The output is the result of executing the defined task. In this particular case, the output will be "Hello, World!".
SOURCE: https://github.com/go-task/task/blob/main/website/docs/getting_started.mdx#_snippet_4

LANGUAGE: shell
CODE:
```
task default
```

----------------------------------------

TITLE: Declaring Task Dependencies in go-task with YAML
DESCRIPTION: This snippet illustrates how to declare dependencies between tasks in go-task using a simple list of task names under the 'deps' property. Each task name string specifies a prerequisite task that must be executed before the current task runs. No additional configuration is needed unless custom variables or settings are required for the dependencies. Inputs are task names; outputs are ordered execution of listed dependencies.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/reference/schema.mdx#_snippet_5

LANGUAGE: yaml
CODE:
```
tasks:
  foo:
    deps: [foo, bar]

```

----------------------------------------

TITLE: Installing Task CLI using Homebrew - Shell
DESCRIPTION: Instructions for installing Task CLI on macOS or Linux systems using Homebrew package manager. Two installation methods are provided: installing from the official Task tap and from the official Homebrew repository. Requires Homebrew installed and accessible on the system's PATH. Outputs are the installed Task CLI binary ready for use.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/installation.mdx#_snippet_0

LANGUAGE: shell
CODE:
```
brew install go-task/tap/go-task
```

LANGUAGE: shell
CODE:
```
brew install go-task
```

----------------------------------------

TITLE: Including Other Taskfiles with Namespaces in Taskfile YAML
DESCRIPTION: Demonstrates the basic syntax for including tasks from other Taskfiles using the `includes` keyword. Each included Taskfile is assigned a namespace, and its tasks are called using that namespace followed by the task name (e.g., `task docs:serve`).
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_8

LANGUAGE: YAML
CODE:
```
version: '3'

includes:
  docs: ./documentation # will look for ./documentation/Taskfile.yml
  docker: ./DockerTasks.yml
```

----------------------------------------

TITLE: Specifying Preconditions with a Shell Command in go-task YAML
DESCRIPTION: This snippet shows how to use a precondition shell command directly within a task definition. If the shell command (e.g., testing for the existence of 'Taskfile.yml') fails, the task will not be executed. No dependencies are required except for the command-line environment that interprets the shell command and go-task itself. The input is a shell string; execution is contingent on its successful completion.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/reference/schema.mdx#_snippet_6

LANGUAGE: yaml
CODE:
```
tasks:
  foo:
    precondition: test -f Taskfile.yml

```

----------------------------------------

TITLE: Using short task syntax for simple Taskfile task definitions in YAML
DESCRIPTION: Illustrates the more concise syntax for defining tasks with default settings in Task v3. Tasks with simple commands can be specified as a single command string or an array without additional structures, improving readability. Demonstrated with a build task running a Go build command and a run task that depends on build.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_47

LANGUAGE: yaml
CODE:
```
version: '3'\n\ntasks:\n  build: go build -v -o ./app{{exeExt}} .\n\n  run:\n    - task: build\n    - ./app{{exeExt}} -h localhost -p 8080
```

----------------------------------------

TITLE: Installing Task via Homebrew Core
DESCRIPTION: Installs the Task command-line tool from the official Homebrew core repository. This is a common method but the package might sometimes lag behind the official tap.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/installation.mdx#_snippet_1

LANGUAGE: shell
CODE:
```
brew install go-task
```

----------------------------------------

TITLE: Basic Templating in YAML
DESCRIPTION: This snippet demonstrates basic templating within a Taskfile using the `echo` command. It defines a variable `MESSAGE` and then uses it within a command using double curly braces to be evaluated.  This showcases how to use the variable's content in the output.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/reference/templating.mdx#_snippet_0

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  hello:
    vars:
      MESSAGE: 'Hello, World!'
    cmds:
      - 'echo {{.MESSAGE}}'
```

----------------------------------------

TITLE: Installing Task via Install Script (Default)
DESCRIPTION: Downloads and runs the official Task install script, which fetches the latest released binary. By default, it installs Task into a './bin' directory relative to the current working directory.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/installation.mdx#_snippet_17

LANGUAGE: shell
CODE:
```
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d
```

----------------------------------------

TITLE: Specifying Task Working Directory in Taskfile YAML
DESCRIPTION: This snippet illustrates setting a custom directory for executing a task using the 'dir' attribute in a Taskfile version 3. When a task is run, all commands execute relative to the specified directory. If the directory does not exist, it is automatically created. This is useful for tasks operating on files or services located in subdirectories. Input includes the target directory path and command list; output corresponds to command execution context.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_2

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  serve:
    dir: public/www
    cmds:
      # run http server
      - caddy
```

----------------------------------------

TITLE: Defining Tasks with Wildcard Arguments in Taskfile (go-task, YAML)
DESCRIPTION: Demonstrates dynamic argument parsing for tasks in Taskfiles using wildcards (*) in the task names, capturing arguments into the .MATCH variable as an array. Variables are extracted for use inside commands, enabling flexible invocation. No external dependencies are required; relies on go-task built-in features. Expected input is a task invocation matching the wildcard pattern; outputs depend on the echo command.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_64

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  start:*:*:
    vars:
      SERVICE: "{{index .MATCH 0}}"
      REPLICAS: "{{index .MATCH 1}}"
    cmds:
      - echo "Starting {{.SERVICE}} with {{.REPLICAS}} replicas"

  start:*:
    vars:
      SERVICE: "{{index .MATCH 0}}"
    cmds:
      - echo "Starting {{.SERVICE}}"
```

----------------------------------------

TITLE: Specifying Task Running Directory
DESCRIPTION: This snippet illustrates how to set a specific directory for task execution using the 'dir' attribute. If the directory does not exist, it will be created automatically; otherwise, tasks run in the specified folder.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_22

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  serve:
    dir: public/www
    cmds:
      - caddy
```

----------------------------------------

TITLE: Loading Environment Variables from Dotenv Files at Task Level in Taskfile YAML
DESCRIPTION: Illustrates loading environment variables from `.env` files using the `dotenv` keyword within a specific task definition. Variables loaded this way are only available to that task and can be useful for task-specific configurations.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_6

LANGUAGE: YAML
CODE:
```
version: '3'

env:
  ENV: testing

tasks:
  greet:
    dotenv: ['.env', '{{.ENV}}/.env', '{{.HOME}}/.env']
    cmds:
      - echo "Using $KEYNAME and endpoint $ENDPOINT"
```

----------------------------------------

TITLE: Listing Tasks with Description in Taskfile (go-task, YAML)
DESCRIPTION: Shows how to define tasks with descriptions using the desc key in a Taskfile. When running task --list, these descriptions are displayed alongside the task names. Dependencies are internal; no external dependencies required. Input is a request to list tasks, and output is the names and descriptions.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_69

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:
    desc: Build the go binary.
    cmds:
      - go build -v -i main.go

  test:
    desc: Run all the go tests.
    cmds:
      - go test -race ./...

  js:
    cmds:
      - esbuild --bundle --minify js/index.js > public/bundle.js

  css:
    cmds:
      - esbuild --bundle --minify css/index.css > public/bundle.css
```

----------------------------------------

TITLE: Configuring Taskfile Schema in VS Code settings.json (JSON)
DESCRIPTION: This snippet shows how to manually configure VS Code's YAML extension to associate the official Taskfile schema URL with specific Taskfile patterns like '**/Taskfile.yml' within your project. This enables autocompletion and validation based on the schema. Requires the Red Hat YAML extension.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/integrations.mdx#_snippet_0

LANGUAGE: json
CODE:
```
{
  "yaml.schemas": {
    "https://taskfile.dev/schema.json": [
      "**/Taskfile.yml",
      "./path/to/any/other/taskfile.yml"
    ]
  }
}
```

----------------------------------------

TITLE: Configuring VS Code YAML Extension for Taskfile Schema (JSON)
DESCRIPTION: This JSON snippet shows how to configure the `yaml.schemas` setting in VS Code's `settings.json` file. It maps the official Taskfile JSON schema URL (`https://taskfile.dev/schema.json`) to specified file patterns (`**/Taskfile.yml`, `./path/to/any/other/taskfile.yml`), enabling validation and autocompletion for those files. This requires the Red Hat YAML extension to be installed.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/integrations.mdx#_snippet_0

LANGUAGE: json
CODE:
```
// settings.json
{
  "yaml.schemas": {
    "https://taskfile.dev/schema.json": [
      "**/Taskfile.yml",
      "./path/to/any/other/taskfile.yml"
    ]
  }
}
```

----------------------------------------

TITLE: Defining Tasks with Alternative YAML Syntax in go-task - YAML
DESCRIPTION: This YAML snippet demonstrates several shortcut syntaxes for defining tasks in go-task. It shows how to assign a shell command directly to a task name, use an array of string commands, or provide a traditional map syntax with 'cmd'. No external dependencies are required, but this assumes Taskfile structure compatibility as per go-task specifications. Each task can declare its commands directly or use the extended map form for extra options, and all commands are executed in a shell environment. Inputs and outputs depend on the task commands specified.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/reference/schema.mdx#_snippet_0

LANGUAGE: yaml
CODE:
```
tasks:
  foo: echo "foo"

  foobar:
    - echo "foo"
    - echo "bar"

  baz:
    cmd: echo "baz"

```

----------------------------------------

TITLE: Using Multiline Commands for Variable Scope in Task (YAML)
DESCRIPTION: Presents a YAML Task definition (`foo`) that uses a single multiline command block (indicated by `|`) as a workaround for command scope limitations. This allows shell variable assignments (`a=foo`) and subsequent usage (`echo $a`) within the same shell process, ensuring the variable is accessible and correctly outputs "foo".
SOURCE: https://github.com/go-task/task/blob/main/website/docs/faq.mdx#_snippet_2

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  foo:
    cmds:
      - |
        a=foo
        echo $a
      # outputs "foo"
```

----------------------------------------

TITLE: Declaring Dynamic Variables with Shell Output (Task - YAML)
DESCRIPTION: Illustrates defining variables using the 'sh:' property to dynamically assign the value from a shell command's output; for example, retrieving a Git commit hash. Dynamic variables are evaluated at runtime and can be used anywhere in the task. Requires Task v3+, underlying shell commands (e.g., 'git') must be present. Limitation: trailing newlines are trimmed.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_43

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:
    cmds:
      - go build -ldflags="-X main.Version={{.GIT_COMMIT}}" main.go
    vars:
      GIT_COMMIT:
        sh: git log -n 1 --format=%h

```

----------------------------------------

TITLE: Defining Static and Dynamic Variables in YAML
DESCRIPTION: Shows the different syntaxes for defining static and dynamic variables in a Taskfile. Static variables use a direct value assignment, while dynamic variables use the 'sh' attribute to execute a shell command.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/reference/schema.mdx#_snippet_1

LANGUAGE: yaml
CODE:
```
vars:
  STATIC: static
  DYNAMIC:
    sh: echo "dynamic"
```

----------------------------------------

TITLE: Grouping Tasks with Only Dependencies in Taskfile YAML
DESCRIPTION: This snippet demonstrates how to create a task that serves as a grouping of other tasks by defining only dependencies and no commands. The 'deps' array lists child tasks that will run, typically in parallel. This pattern facilitates task organization and orchestration without specific commands on the grouping task itself, improving modularity. Input is task names with dependency lists; output is execution of dependent tasks.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_4

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  assets:
    deps: [js, css]

  js:
    cmds:
      - esbuild --bundle --minify js/index.js > public/bundle.js

  css:
    cmds:
      - esbuild --bundle --minify css/index.css > public/bundle.css
```

----------------------------------------

TITLE: Overriding Variable Defaults via CLI (Task - YAML and Shell)
DESCRIPTION: Combines YAML and shell examples to show how to provide a default variable with Go template syntax and override its value via the command line. Demonstrates outputs for both default and overridden variable cases. Requires Task, knowledge of Go template default operator. Inputs: USER_NAME. Outputs: echo greeting. Limitation: default expression must be valid Go template.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_41

LANGUAGE: yaml
CODE:
```
version: '3'

  greet_user:
    desc: "Greet the user with a name."
    vars:
      USER_NAME: '{{.USER_NAME| default "DefaultUser"}}'
    cmds:
      - echo "Hello, {{.USER_NAME}}!"

```

----------------------------------------

TITLE: Requiring Variable Presence with 'requires.vars' (Task - YAML)
DESCRIPTION: Demonstrates enforcing the presence of specific variables (including environment variables) before task execution via 'requires.vars'. If required variables are unset, Task raises an error and aborts the run. Requires Task v3+, with variables IMAGE_NAME and IMAGE_TAG. No output if requirements are not met. Limitation: variables set to empty string are accepted.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_34

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  docker-build:
    cmds:
      - 'docker build . -t {{.IMAGE_NAME}}:{{.IMAGE_TAG}}'

    # Make sure these variables are set before running
    requires:
      vars: [IMAGE_NAME, IMAGE_TAG]

```

----------------------------------------

TITLE: Defining Internal Tasks in Taskfile YAML
DESCRIPTION: This snippet shows how to define internal tasks in a Taskfile to prevent them from being called directly by users or appearing in task listings. The 'internal: true' property marks tasks as internal, while other tasks can call them by name. This pattern is useful for reusable, function-like tasks intended only for invocation within other tasks. Commands are specified under 'cmds'. Inputs include task names and variables; outputs are task executions without direct user visibility.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_1

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build-image-1:
    cmds:
      - task: build-image
        vars:
          DOCKER_IMAGE: image-1

  build-image:
    internal: true
    cmds:
      - docker build -t {{.DOCKER_IMAGE}} .
```

----------------------------------------

TITLE: Using 'prefixed' output mode with custom prefixes per task in Taskfile YAML
DESCRIPTION: Configures Taskfile to use the 'prefixed' output mode globally, where each line output by subtasks is prefixed with a label based on the task name by default. This snippet further customizes prefixes on a per-task basis with templated variables (e.g., '{{.TEXT}}'). It demonstrates task dependencies running tasks with different prefix variables and suppressing default output logs with 'silent: true'.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_44

LANGUAGE: yaml
CODE:
```
version: '3'\n\noutput: prefixed\n\ntasks:\n  default:\n    deps:\n      - task: print\n        vars: { TEXT: foo }\n      - task: print\n        vars: { TEXT: bar }\n      - task: print\n        vars: { TEXT: baz }\n\n  print:\n    cmds:\n      - echo "{{.TEXT}}"\n    prefix: 'print-{{.TEXT}}'\n    silent: true
```

----------------------------------------

TITLE: Setting Default Variable Values Overridable via CLI in Go Task (YAML)
DESCRIPTION: Defines a Go Task task `greet_user` with a variable `USER_NAME` that uses the `default` template function (`{{.USER_NAME | default "DefaultUser"}}`) to provide a default value if the variable is not set via the command line.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_21

LANGUAGE: yaml
CODE:
```
version: '3'

  greet_user:
    desc: "Greet the user with a name."
    vars:
      USER_NAME: '{{.USER_NAME| default "DefaultUser"}}'
    cmds:
      - echo "Hello, {{.USER_NAME}}!"
```

----------------------------------------

TITLE: Setting Parent Shell Environment Variables using Task Output in YAML
DESCRIPTION: This Taskfile defines a task `my-shell-env` that outputs `export` commands. These commands can be evaluated in the parent shell (e.g., `eval $(task my-shell-env)`) to set environment variables like `FOO` and `BAR`, working around the limitation that subprocesses cannot modify their parent's environment.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/faq.mdx#_snippet_0

LANGUAGE: yaml
CODE:
```
my-shell-env:
  cmds:
    - echo "export FOO=foo"
    - echo "export BAR=bar"
```

----------------------------------------

TITLE: Combining Status Checks with Fingerprinting in Go Task (YAML)
DESCRIPTION: Illustrates a Go Task task `build:prod` that uses `sources` and `generates` for file fingerprinting and adds a `status` check using `grep` to ensure a specific condition (`"dev": false`) exists in a generated file (`./vendor/composer/installed.json`). The task runs if either sources/generated files change or the status check fails.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_10

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:prod:
    desc: Build for production usage.
    cmds:
      - composer install
    # Run this task if source files changes.
    sources:
      - composer.json
      - composer.lock
    generates:
      - ./vendor/composer/installed.json
      - ./vendor/autoload.php
    # But also run the task if the last build was not a production build.
    status:
      - grep -q '"dev": false' ./vendor/composer/installed.json
```

----------------------------------------

TITLE: Requiring Variables Before Task Execution in Go Task (YAML)
DESCRIPTION: Defines a Go Task task `docker-build` that uses `requires.vars` to ensure the `IMAGE_NAME` and `IMAGE_TAG` variables are set before executing the `docker build` command. The task will error if these variables are missing.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_14

LANGUAGE: yaml
CODE:
```
requires:
  vars: [] # Array of strings
```

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  docker-build:
    cmds:
      - 'docker build . -t {{.IMAGE_NAME}}:{{.IMAGE_TAG}}'

    # Make sure these variables are set before running
    requires:
      vars: [IMAGE_NAME, IMAGE_TAG]
```

----------------------------------------

TITLE: Specifying Platform Restrictions for Tasks
DESCRIPTION: This snippet illustrates how to restrict task execution to specific platforms using the 'platforms' attribute, which can specify OS, architecture, or both. Commands or tasks are skipped if platform conditions are not met.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_25

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build-windows:
    platforms: [windows]
    cmds:
      - echo 'Running command on Windows'

  build-windows-amd64:
    platforms: [windows/amd64]
    cmds:
      - echo 'Running command on Windows (amd64)'

  build-amd64:
    platforms: [amd64]
    cmds:
      - echo 'Running command on amd64'

  build:
    platforms: [windows/amd64, darwin]
    cmds:
      - echo 'Running command on Windows (amd64) and macOS'

  build-commands:
    cmds:
      - cmd: echo 'Running command on Windows (amd64) and macOS'
        platforms: [windows/amd64, darwin]
      - cmd: echo 'Running on all platforms'

```

----------------------------------------

TITLE: Validating Required Variable Values with Enum in Go Task (YAML)
DESCRIPTION: Configures a Go Task task `deploy` using `requires.vars.enum` to validate that the `ENV` variable is one of 'dev', 'beta', or 'prod'. The task will fail if `ENV` has any other value. This check applies to string variables only.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_15

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  deploy:
    cmds:
      - echo "deploying to {{.ENV}}"

    requires:
      vars:
        - name: ENV
          enum: [dev, beta, prod]
```

----------------------------------------

TITLE: Task Cleanup with Defer Referencing Another Task
DESCRIPTION: Demonstrates how to use defer to reference another task for cleanup operations, which allows for better organization of cleanup logic in separate tasks.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_27

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  default:
    cmds:
      - mkdir -p tmpdir/
      - defer: { task: cleanup }
      - echo 'Do work on tmpdir/'

  cleanup: rm -rf tmpdir/
```

----------------------------------------

TITLE: Example shell output demonstrating error_only group output behavior
DESCRIPTION: Terminal output showing the behavior of the error_only 'group' output option. The 'passes' task produces no output since it succeeds, while the 'errors' task outputs error messages and a failure notice with exit status. This helps to avoid clutter from successful commands, focusing user attention on errors.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_43

LANGUAGE: shell
CODE:
```
$ task passes\n$ task errors\noutput-of-errors\ntask: Failed to run task "errors": exit status 1
```

----------------------------------------

TITLE: Defining Namespace Aliases in Taskfile YAML
DESCRIPTION: This snippet demonstrates how to include an external Taskfile with a namespace alias using the 'includes' key in a Taskfile version 3 configuration. The 'aliases' option allows defining shorter alternative names to invoke included tasks conveniently. It requires a properly formatted included Taskfile path and optionally defines variable default behavior to allow overridable variables within included Taskfiles. Inputs are YAML configuration files; output is a namespaced alias facilitating task invocation.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_0

LANGUAGE: yaml
CODE:
```
version: '3'

includes:
  generate:
    taskfile: ./taskfiles/Generate.yml
    aliases: [gen]
```

----------------------------------------

TITLE: Excluding Tasks from Inclusion (Main Taskfile) YAML
DESCRIPTION: Shows how to prevent specific tasks from being included from another Taskfile using the `excludes` option within the include definition. This example includes `Included.yml` but explicitly excludes the `foo` task.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_17

LANGUAGE: YAML
CODE:
```
version: '3'
  includes:
    included:
      taskfile: ./Included.yml
      excludes: [foo]
```

----------------------------------------

TITLE: Using Status Checks for Task Up-to-Date Verification in Go Task (YAML)
DESCRIPTION: Defines a Go Task task `generate-files` that creates files and uses shell `test` commands within the `status` block to check if the generated directory and files exist. If all status commands succeed (exit code 0), the task is considered up-to-date.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_9

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  generate-files:
    cmds:
      - mkdir directory
      - touch directory/file1.txt
      - touch directory/file2.txt
    # test existence of files
    status:
      - test -d directory
      - test -f directory/file1.txt
      - test -f directory/file2.txt
```

----------------------------------------

TITLE: Indicating Up-to-Date Status Using Programmatic Checks (Task - YAML)
DESCRIPTION: Demonstrates use of the 'status' stanza in a Taskfile to programmatically determine if a task should be considered up-to-date. Each command in 'status' is executed, and if all return exit 0, the task is skipped; otherwise, it is run. Depends on Task v3 or later, requires valid shell commands available in the environment. Inputs: none. Outputs: generates and checks directory and file existence. Limitations: Only shell return codes are evaluated.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_29

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  generate-files:
    cmds:
      - mkdir directory
      - touch directory/file1.txt
      - touch directory/file2.txt
    # test existence of files
    status:
      - test -d directory
      - test -f directory/file1.txt
      - test -f directory/file2.txt

```

----------------------------------------

TITLE: Setting Task Variables Inline with Command (Shell)
DESCRIPTION: Shows an alternative method for setting Go Task variables (`FILE`, `CONTENT`, `MESSAGE`) directly within the `task` command line, suitable for shells that don't support prefixing environment variables (like Windows cmd).
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_18

LANGUAGE: shell
CODE:
```
$ task write-file FILE=file.txt "CONTENT=Hello, World!" print "MESSAGE=All done!"
```

----------------------------------------

TITLE: Defining Local Task Variables in Go Task (YAML)
DESCRIPTION: Illustrates defining a variable `VAR` locally within the `print-var` task definition in a Go Taskfile using the `vars` keyword. This variable is only scoped to this specific task.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_19

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  print-var:
    cmds:
      - echo "{{.VAR}}"
    vars:
      VAR: Hello!
```

----------------------------------------

TITLE: Passing Parameters with Environment Variables (Task - Shell)
DESCRIPTION: Shows how to set task variables on the command line using shell syntax when invoking Task. This method is compatible with Unix-like shells and some other environments. No special dependencies beyond shell and Task binary. Input: variable=value pairs. Output: variable available inside the invoked task. Limitation: non-portable to Windows shells.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_37

LANGUAGE: shell
CODE:
```
$ TASK_VARIABLE=a-value task do-something

```

----------------------------------------

TITLE: Combining Status Checks with Fingerprinting for Task Re-execution (Task - YAML)
DESCRIPTION: Shows how to use 'sources', 'generates', and 'status' together to rerun tasks only when relevant source content changes or when programmatic checks fail. The task runs if source files change, generated artifacts change, or a grep condition on the output JSON fails. Requires Task v3+, a shell with grep, and composer installed. Inputs: composer.json, composer.lock; Outputs: generated Composer files; Limitation: 'status' check is a grep expression; ensure file exists or initialization fails.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_30

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:prod:
    desc: Build for production usage.
    cmds:
      - composer install
    # Run this task if source files changes.
    sources:
      - composer.json
      - composer.lock
    generates:
      - ./vendor/composer/installed.json
      - ./vendor/autoload.php
    # But also run the task if the last build was not a production build.
    status:
      - grep -q '"dev": false' ./vendor/composer/installed.json

```

----------------------------------------

TITLE: Using Preconditions to Gate Task Execution in Go Task (YAML)
DESCRIPTION: Defines a Go Task task `generate-files` using `preconditions`. It checks for the existence of a `.env` file and evaluates a shell command (`[ 1 = 0 ]`). If any precondition fails, the task (and its dependencies) will not run, and a custom message can be displayed.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_11

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  generate-files:
    cmds:
      - mkdir directory
      - touch directory/file1.txt
      - touch directory/file2.txt
    # test existence of files
    preconditions:
      - test -f .env
      - sh: '[ 1 = 0 ]'
        msg: "One doesn't equal Zero, Halting"
```

----------------------------------------

TITLE: Cancelling Task Execution via Preconditions (Task - YAML)
DESCRIPTION: Illustrates using the 'preconditions' stanza to halt task execution if prerequisite checks fail, including support for 'sh' commands and 'msg' error messages for user feedback. Tasks are skipped if any precondition returns nonzero status. Intended for cases where file/environment assumptions must be guaranteed. Task v3+ required. Inputs: files, environment; no outputs. Limitation: tasks with unmet preconditions fail with error.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_31

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  generate-files:
    cmds:
      - mkdir directory
      - touch directory/file1.txt
      - touch directory/file2.txt
    # test existence of files
    preconditions:
      - test -f .env
      - sh: '[ 1 = 0 ]'
        msg: "One doesn't equal Zero, Halting"

```

----------------------------------------

TITLE: Looping: Dynamic Variables
DESCRIPTION: Showcases how to loop over a dynamic variable, e.g. a variable whose value is generated via a `sh` command. The example uses `find` to generate a list of files.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_58

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  default:
    vars:
      MY_VAR:
        sh: find -type f -name '*.txt'
    cmds:
      - for: { var: MY_VAR }
        cmd: cat {{.ITEM}}
```

----------------------------------------

TITLE: Demonstrating Precondition Failure Propagation in Go Task (YAML)
DESCRIPTION: Shows how a failing precondition in one Go Task task (`task-will-fail`) prevents dependent tasks (`task-will-also-fail`, `task-will-still-fail`) from executing. A precondition failure halts the entire chain unless `--force` is used.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_12

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  task-will-fail:
    preconditions:
      - sh: 'exit 1'

  task-will-also-fail:
    deps:
      - task-will-fail

  task-will-still-fail:
    cmds:
      - task: task-will-fail
      - echo "I will not run"
```

----------------------------------------

TITLE: Defining and Using Different Variable Types (Task - YAML)
DESCRIPTION: Provides examples of declaring string, bool, int, float, array, and map variables within a Taskfile, exposing access patterns for templates and command lines. Demonstrates echoing each variable's value. Requires Task v3+. Inputs: none; outputs: terminal print. Limitation: maps require special 'map' subkey structure.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_36

LANGUAGE: yaml
CODE:
```
version: 3

tasks:
  foo:
    vars:
      STRING: 'Hello, World!'
      BOOL: true
      INT: 42
      FLOAT: 3.14
      ARRAY: [1, 2, 3]
      MAP:
        map: {A: 1, B: 2, C: 3}
    cmds:
      - 'echo {{.STRING}}'  # Hello, World!
      - 'echo {{.BOOL}}'    # true
      - 'echo {{.INT}}'     # 42
      - 'echo {{.FLOAT}}'   # 3.14
      - 'echo {{.ARRAY}}'   # [1 2 3]
      - 'echo {{.ARRAY.0}}' # 1
      - 'echo {{.MAP}}'     # map[A:1 B:2 C:3]
      - 'echo {{.MAP.A}}'   # 1

```

----------------------------------------

TITLE: Using Default Template Function to Provide Fallback Environment Variable Value
DESCRIPTION: This YAML snippet illustrates how to use the 'default' template function in Go Task to provide a fallback value for an environment variable if it is not set. It shows an environment variable 'MY_ENV' assigned with the template expression that falls back to the string 'fallback' when 'MY_ENV' is unset or empty, enabling robust handling of optional environment variables.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/experiments/env_precedence.mdx#_snippet_2

LANGUAGE: YAML
CODE:
```
MY_ENV: '{{.MY_ENV | default "fallback"}}'
```

----------------------------------------

TITLE: Calling Another Task Serially in Taskfile YAML
DESCRIPTION: This snippet details how to call tasks sequentially by listing calls inside the 'cmds' array via 'task:' syntax. This enables serial execution instead of parallel dependencies, ensuring one task completes before the next starts. Variables and silent mode can be passed per call to customize execution and output visibility. Inputs are task calls and optional parameters; outputs are sequential task invocations.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_7

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  main-task:
    cmds:
      - task: task-to-be-called
      - task: another-task
      - echo "Both done"

  task-to-be-called:
    cmds:
      - echo "Task to be called"

  another-task:
    cmds:
      - echo "Another task"
```

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  greet:
    vars:
      RECIPIENT: '{{default "World" .RECIPIENT}}'
    cmds:
      - echo "Hello, {{.RECIPIENT}}!"

  greet-pessimistically:
    cmds:
      - task: greet
        vars: { RECIPIENT: 'Cruel World' }
        silent: true
```

----------------------------------------

TITLE: Forwarding CLI Args
DESCRIPTION: Shows how to capture and forward command-line arguments given after `--` to a command using the `.CLI_ARGS` variable.  This is useful for passing arguments to external tools.  For example `task yarn -- install` will run `yarn install`.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_63

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  yarn:
    cmds:
      - yarn {{.CLI_ARGS}}
```

----------------------------------------

TITLE: Setting Global Environment Variables in Taskfile YAML
DESCRIPTION: Demonstrates defining environment variables that are available to all tasks within the Taskfile by using the `env` keyword at the top level. These global variables provide default values that can be overridden by task-specific `env` settings.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_4

LANGUAGE: YAML
CODE:
```
version: '3'

env:
  GREETING: Hey, there!

tasks:
  greet:
    cmds:
      - echo $GREETING
```

----------------------------------------

TITLE: Conditional Templating in YAML
DESCRIPTION: This snippet illustrates conditional logic in a Taskfile using the `if`, `else`, and `end` control flow operators.  It shows how to use a boolean variable (`HAPPY`) to determine the output string. The snippet demonstrates the use of the `if` and `else` constructs for conditional output.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/reference/templating.mdx#_snippet_1

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  maybe-happy:
    vars:
      SMILE: ':\)'
      FROWN: ':\('
      HAPPY: true
    cmds:
      - 'echo {{if .HAPPY}}{{.SMILE}}{{else}}{{.FROWN}}{{end}}'
```

----------------------------------------

TITLE: Looping: Matrix using References
DESCRIPTION: This example extends matrix looping, demonstrating the use of references to other variables as list values. This allows for dynamic definition of the matrix.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_50

LANGUAGE: yaml
CODE:
```
version: "3"

vars:
  OS_VAR: ["windows", "linux", "darwin"]
  ARCH_VAR: ["amd64", "arm64"]

tasks:
  default:
    cmds:
      - for:
          matrix:
            OS:
              ref: .OS_VAR
            ARCH:
              ref: .ARCH_VAR
        cmd: echo "{{.ITEM.OS}}/{{.ITEM.ARCH}}"
```

----------------------------------------

TITLE: Fingerprinting Files to Avoid Unnecessary Work
DESCRIPTION: This snippet shows how to enable fingerprinting based on source and generated files to avoid re-running tasks unnecessarily. The checksum or timestamp methods can be used for validation, with options for excluding files and custom status checks.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_28

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:
    deps: [js, css]
    cmds:
      - go build -v -i main.go

  js:
    cmds:
      - esbuild --bundle --minify js/index.js > public/bundle.js
    sources:
      - src/js/**/*.js
    generates:
      - public/bundle.js

  css:
    cmds:
      - esbuild --bundle --minify css/index.css > public/bundle.css
    sources:
      - src/css/**/*.css
    generates:
      - public/bundle.css
```

----------------------------------------

TITLE: Looping: Different Tasks per Iteration
DESCRIPTION: This example shows how to run different tasks within a loop, depending on the loop's item value.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_61

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  default:
    cmds:
      - for: [foo, bar]
        task: task-{{.ITEM}}

  task-foo:
    cmds:
      - echo 'foo'

  task-bar:
    cmds:
      - echo 'bar'
```

----------------------------------------

TITLE: Defining Dynamic Variables from Shell Output in Go Task (YAML)
DESCRIPTION: Illustrates how to define a dynamic variable `GIT_COMMIT` in a Go Taskfile. The value is obtained by executing the shell command `git log -n 1 --format=%h` using the `sh:` syntax under the `vars` definition. The output of the command becomes the variable's value.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_23

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  build:
    cmds:
      - go build -ldflags="-X main.Version={{.GIT_COMMIT}}" main.go
    vars:
      GIT_COMMIT:
        sh: git log -n 1 --format=%h
```

----------------------------------------

TITLE: Defining Task Summaries and Dependencies in Taskfile (go-task, YAML)
DESCRIPTION: Demonstrates using the summary and deps fields in a Taskfile to provide multi-line usage explanations for tasks and specify prerequisite dependencies. Input is a task summary query; outputs are the summary, dependencies, and command lists. No external dependencies required; summary is displayed without execution.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_71

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  release:
    deps: [build]
    summary: |
      Release your project to github

      It will build your project before starting the release.
      Please make sure that you have set GITHUB_TOKEN before starting.
    cmds:
      - your-release-tool

  build:
    cmds:
      - your-build-tool
```

----------------------------------------

TITLE: Adding Build Task - YAML
DESCRIPTION: This YAML snippet extends an existing Taskfile by adding a `build` task. This task compiles a Go program found in the specified location. The code builds a Go program. The `cmds` attribute within `build` defines a single command to be executed. It requires the Go programming language installed on the host system. The command assumes the path to the Go program is correct.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/getting_started.mdx#_snippet_7

LANGUAGE: yaml
CODE:
```
version: '3'

vars:
  GREETING: Hello, World!

tasks:
  default:
    cmds:
      - echo "{{.GREETING}}"
    silent: true

  build:
    cmds:
      - go build ./cmd/main.go
```

----------------------------------------

TITLE: Using Multiline Commands for Shared State in Task YAML
DESCRIPTION: This Taskfile demonstrates a workaround for separate command scopes by using a YAML multiline string (`|`). This allows multiple shell commands to run within the same shell process, enabling state sharing (like the variable `a`) between them.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/faq.mdx#_snippet_2

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  foo:
    cmds:
      - |
        a=foo
        echo $a
      # outputs "foo"
```

----------------------------------------

TITLE: Enabling Interactive Mode for CLI Applications
DESCRIPTION: This snippet shows how to configure a task to recognize the command as an interactive CLI application by setting 'interactive: true.' This allows tools like Vim to run properly within Task, optimizing terminal behavior for interactive apps.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_85

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  default:
    cmds:
      - vim my-file.txt
    interactive: true
```

----------------------------------------

TITLE: Installing Task CLI in GitHub Actions workflow - YAML
DESCRIPTION: Example configuration snippet to install Task CLI inside a GitHub Actions workflow using the community-maintained setup-task action by Arduino. Allows specifying version and uses GitHub repo token for authentication.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/installation.mdx#_snippet_11

LANGUAGE: yaml
CODE:
```
- name: Install Task
  uses: arduino/setup-task@v2
  with:
    version: 3.x
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

----------------------------------------

TITLE: Setting Task Variables via Environment Variables (Shell)
DESCRIPTION: Provides an example of setting a Go Task variable (`TASK_VARIABLE`) by prefixing the `task` command with an environment variable assignment in a shell environment.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_17

LANGUAGE: shell
CODE:
```
$ TASK_VARIABLE=a-value task do-something
```

----------------------------------------

TITLE: Taskfile with Build Task for Go Application - YAML
DESCRIPTION: This YAML example expands a Taskfile to include a 'build' task for compiling a Go project. The 'build' task calls 'go build' on a specified source file, working alongside the default task described earlier. Requires Go to be installed and accessible on the system PATH; Task interprets the command natively using mvdan/sh. Inputs are defined via YAML keys, and outputs are subject to the underlying Go compiler.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/getting_started.mdx#_snippet_7

LANGUAGE: yaml
CODE:
```
version: '3'

vars:
  GREETING: Hello, World!

tasks:
  default:
    cmds:
      - echo "{{.GREETING}}"
    silent: true

  build:
    cmds:
      - go build ./cmd/main.go

```

----------------------------------------

TITLE: Looping Over Variables (After) - Task YAML
DESCRIPTION: Demonstrates the streamlined method for looping over Task variables using the `for` command. The variable (`LIST`) is defined directly as a YAML array. The `for` command can iterate over the array elements directly without needing the `split` subkey, simplifying iteration over list-based variables.
SOURCE: https://github.com/go-task/task/blob/main/website/blog/2024-05-09-any-variables.mdx#_snippet_5

LANGUAGE: yaml
CODE:
```
version: 3

tasks:
  foo:
    vars:
      LIST: ['foo', 'bar', 'baz']
    cmds:
      - for:
          var: LIST
        cmd: echo {{.ITEM}}

```

----------------------------------------

TITLE: Task-Level Silent Mode
DESCRIPTION: Shows how to enable silent mode at the task level to prevent all commands in the task from being echoed before execution.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_36

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  echo:
    cmds:
      - echo "Print something"
    silent: true
```

----------------------------------------

TITLE: Defining Taskfile with Namespace Aliases
DESCRIPTION: This snippet demonstrates how to include another Taskfile with assigned aliases, allowing for shorter command invocations. Variables in included Taskfiles can be overridden using the default function to manage defaults.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_20

LANGUAGE: yaml
CODE:
```
version: '3'

includes:
  generate:
    taskfile: ./taskfiles/Generate.yml
    aliases: [gen]
```

----------------------------------------

TITLE: Defining Global Variables in Go Task (YAML)
DESCRIPTION: Demonstrates defining a global variable `GREETING` at the root level of a Go Taskfile using the `vars:` block. This variable is accessible by all tasks within the file unless overridden locally.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_20

LANGUAGE: yaml
CODE:
```
version: '3'

vars:
  GREETING: Hello from Taskfile!

tasks:
  greet:
    cmds:
      - echo "{{.GREETING}}"
```

----------------------------------------

TITLE: Suppressing STDOUT Using Shell Redirection in Taskfile (go-task, YAML)
DESCRIPTION: Shows how to suppress output of a specific command in a Taskfile by redirecting stdout to /dev/null. Input is standard task invocation; output is suppressed (nothing printed). No dependencies beyond go-task and shell.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_80

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  echo:
    cmds:
      - echo "This will print nothing" > /dev/null
```

----------------------------------------

TITLE: Configuring 'group' output mode with error_only option in Taskfile YAML
DESCRIPTION: Shows how to configure the 'group' output mode with the 'error_only: true' option to suppress output for successful tasks and only show the output if the command returns a non-zero exit code. Includes defining multiple tasks, one which passes silently and one which fails and prints output. The global 'silent: true' setting suppresses default output outside error cases.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_42

LANGUAGE: yaml
CODE:
```
version: '3'\n\nsilent: true\n\noutput:\n  group:\n    error_only: true\n\ntasks:\n  passes: echo 'output-of-passes'\n  errors: echo 'output-of-errors' && exit 1
```

----------------------------------------

TITLE: Multiple Warning Prompts
DESCRIPTION: Shows how to configure multiple sequential warning prompts for a task, where the user must confirm each prompt before the task will execute.
SOURCE: https://github.com/go-task/task/blob/main/website/versioned_docs/version-latest/usage.mdx#_snippet_34

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  example:
    cmds:
      - task: dangerous

  dangerous:
    prompt:
     - This is a dangerous command... Do you want to continue?
     - Are you sure?
    cmds:
      - echo 'dangerous command'
```

----------------------------------------

TITLE: Looping Over Variables (Before) - Task YAML
DESCRIPTION: Depicts the older method for looping over variable content in Task. It required the variable (`LIST`) to be a delimiter-separated string. The `for` command used the `split` subkey to specify the delimiter (`,`) to break the string into items for iteration.
SOURCE: https://github.com/go-task/task/blob/main/website/blog/2024-05-09-any-variables.mdx#_snippet_4

LANGUAGE: yaml
CODE:
```
version: 3

tasks:
  foo:
    vars:
      LIST: 'foo,bar,baz'
    cmds:
      - for:
          var: LIST
          split: ','
        cmd: echo {{.ITEM}}

```

----------------------------------------

TITLE: Overriding Task Name with Labels in Taskfile (go-task, YAML)
DESCRIPTION: Shows how to use the label field to override the task name as printed in summaries and STDOUT messages. The label can include interpolated variables, enabling dynamic labeling based on task parameters. No dependencies beyond go-task; primary input is variable assignment; output is the echoed label or message.
SOURCE: https://github.com/go-task/task/blob/main/website/docs/usage.mdx#_snippet_74

LANGUAGE: yaml
CODE:
```
version: '3'

tasks:
  default:
    - task: print
      vars:
        MESSAGE: hello
    - task: print
      vars:
        MESSAGE: world

  print:
    label: 'print-{{.MESSAGE}}'
    cmds:
      - echo "{{.MESSAGE}}"
```