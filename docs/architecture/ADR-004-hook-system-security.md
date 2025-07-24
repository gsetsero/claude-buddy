# ADR-004: Security-First Hook System Design

**Status**: Accepted  
**Date**: 2024-07-22  
**Authors**: Claude Code Buddy Contributors  
**Reviewers**: Development Team  

## Context

Claude Code Buddy integrates with Claude Code through a hook system that executes Python scripts for file protection, command validation, and automation. Since hooks run automatically during development workflows, they present potential security risks:

- Arbitrary code execution in the development environment
- Access to sensitive files and directories
- Potential for malicious script injection
- Need for safe command validation without compromising security
- Protection against accidental destructive operations

The hook system needed to be designed with security as the primary concern while maintaining functionality and usability.

## Decision

Implement a security-first hook system with multiple layers of protection:

1. **File Guard System**: Protect critical files from accidental modification
2. **Command Validation**: Validate commands before execution with allowlists
3. **Input Sanitization**: Comprehensive input validation and escaping
4. **Execution Isolation**: UV-based isolation and controlled script execution
5. **Audit Logging**: Track all hook executions for security monitoring
6. **Fail-Safe Defaults**: Conservative behavior when security checks fail

## Options Considered

### Option 1: No Hook System
- **Pros**: 
  - No security risks from hook execution
  - Simple implementation
  - No execution overhead
- **Cons**: 
  - Limited automation capabilities
  - No file protection
  - Manual command validation required
  - Reduced developer productivity

### Option 2: Simple Hook Execution Without Security
- **Pros**: 
  - Maximum flexibility
  - Easy to implement
  - No security overhead
- **Cons**: 
  - Significant security risks
  - No protection against malicious scripts
  - Potential for accidental damage
  - Unsuitable for production environments

### Option 3: Security-First Hook System (Selected)
- **Pros**: 
  - Multi-layered security protection
  - Safe automation capabilities
  - File protection against accidents
  - Audit trail for security monitoring
  - Controlled script execution environment
- **Cons**: 
  - Implementation complexity
  - Performance overhead for security checks
  - Potential for false positives in validation

### Option 4: Sandboxed Execution Environment
- **Pros**: 
  - Complete isolation
  - Maximum security
  - No risk to host system
- **Cons**: 
  - Significant implementation complexity
  - Limited access to development environment
  - Performance impact of sandboxing
  - Platform compatibility issues

## Consequences

### Positive Outcomes
- **Security Assurance**: Multiple layers of protection against malicious or accidental damage
- **File Protection**: Critical files (configs, security files) protected from modification
- **Command Validation**: Dangerous commands blocked before execution
- **Audit Trail**: Complete logging of hook executions for security analysis
- **Developer Safety**: Safe automation without compromising system security
- **Compliance**: Meets security requirements for enterprise environments

### Negative Outcomes
- **Performance Overhead**: Security checks add latency to hook execution
- **Complexity**: More sophisticated implementation and testing requirements
- **False Positives**: Legitimate operations may be blocked by conservative security rules
- **Maintenance**: Security rules and allowlists require ongoing updates

### Neutral Impacts
- **Functionality**: Core automation capabilities preserved with security constraints
- **User Experience**: Minimal impact on normal development workflows

## Implementation

### 1. File Guard System (`file-guard.py`)

Protects critical files using configurable rules:

```python
PROTECTED_PATTERNS = [
    r'\.env$',           # Environment files
    r'\.env\.',          # Environment variants
    r'keys?\.json$',     # Key files  
    r'secrets?\.json$',  # Secret files
    r'\.ssh/',           # SSH directory
    r'\.aws/',           # AWS credentials
    r'\.config/.*auth',  # Auth configs
]

def is_protected_file(file_path):
    """Check if file should be protected from modification"""
    for pattern in PROTECTED_PATTERNS:
        if re.search(pattern, file_path, re.IGNORECASE):
            return True
    return False
```

### 2. Command Validator (`command-validator.py`)

Validates commands against allowlists and blocklists:

```python
DANGEROUS_COMMANDS = [
    'rm -rf /',
    'format c:',
    'dd if=',
    '> /dev/',
    'chmod 777',
]

ALLOWED_COMMANDS = [
    'git', 'npm', 'yarn', 'node', 'python', 'pip',
    'code', 'vim', 'nano', 'ls', 'cat', 'grep'
]

def validate_command(command):
    """Validate command for safety before execution"""
    # Check against dangerous patterns
    for dangerous in DANGEROUS_COMMANDS:
        if dangerous in command.lower():
            return False, f"Dangerous command blocked: {dangerous}"
    
    # Validate against allowed commands
    cmd_parts = command.strip().split()
    if cmd_parts and cmd_parts[0] not in ALLOWED_COMMANDS:
        return False, f"Command not in allowlist: {cmd_parts[0]}"
    
    return True, "Command validated"
```

### 3. Input Sanitization

All inputs are sanitized before processing:

```python
import shlex
import html

def sanitize_input(user_input):
    """Sanitize user input to prevent injection attacks"""
    # HTML escape
    sanitized = html.escape(user_input)
    
    # Shell escape for command execution
    sanitized = shlex.quote(sanitized)
    
    # Remove null bytes and control characters
    sanitized = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', sanitized)
    
    return sanitized
```

### 4. UV Execution Isolation

Hooks execute through UV with controlled environment:

```json
{
  "file_guard": {
    "command": "uv run --no-project python {{INSTALL_DIR}}/hooks/file-guard.py",
    "timeout": 5000,
    "isolation": "process"
  }
}
```

### 5. Audit Logging

All hook executions are logged for security monitoring:

```python
import logging
import json
from datetime import datetime

def log_hook_execution(hook_name, command, result, user_context):
    """Log hook execution for security audit"""
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'hook': hook_name,
        'command': command,
        'result': result,
        'user': user_context.get('user', 'unknown'),
        'working_dir': user_context.get('cwd', 'unknown'),
        'files_accessed': user_context.get('files', [])
    }
    
    logging.info(f"HOOK_EXECUTION: {json.dumps(log_entry)}")
```

### 6. Configuration Security

Hook configurations are validated at load time:

```typescript
interface SecureHookConfig {
  command: string;
  timeout: number;           // Maximum execution time
  allowedPaths: string[];    // Restricted file access
  environment: 'isolated';   // Execution environment
  validation: 'strict';      // Input validation level
}

function validateHookConfig(config: SecureHookConfig): boolean {
  // Validate command doesn't contain dangerous patterns
  // Check timeout is reasonable (< 30 seconds)
  // Ensure paths are within allowed directories
  // Verify environment isolation is enabled
  return isConfigSecure(config);
}
```

## Monitoring and Success Criteria

Security indicators:
- ✅ Zero security incidents from hook execution
- ✅ All dangerous commands successfully blocked
- ✅ Protected files remain unmodified by hooks
- ✅ Complete audit trail of hook executions
- ✅ Input sanitization preventing injection attacks

Ongoing monitoring:
- Hook execution audit logs reviewed regularly
- Security rule effectiveness metrics
- False positive rates for validation rules
- Performance impact of security checks
- User feedback on security restrictions

## Related ADRs

- [ADR-003](./ADR-003-uv-python-package-management.md) - UV provides execution isolation for hooks
- [ADR-001](./ADR-001-typescript-migration.md) - TypeScript enables type-safe hook configuration
- [ADR-002](./ADR-002-persona-system-architecture.md) - Security persona integrates with hook validation

## References

- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Python Security Best Practices](https://python.org/dev/security/)
- [Command Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [Input Validation Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)