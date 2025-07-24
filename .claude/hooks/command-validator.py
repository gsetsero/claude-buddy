#!/usr/bin/env python3
"""
Claude Code Buddy - Command Validation Hook

This PreToolUse hook validates and blocks dangerous bash commands before execution.
It helps prevent accidental system damage and promotes safer development practices.
"""

import sys
import json
import os
import re
from typing import List, Dict, Any, Tuple

# Dangerous command patterns that should be blocked
DANGEROUS_COMMANDS = [
    # Destructive file operations
    (r"rm\s+.*-rf?\s+/", "Recursive deletion from root directory"),
    (r"rm\s+.*-rf?\s+\*", "Recursive deletion with wildcards"),
    (r"rm\s+.*-rf?\s+~", "Recursive deletion from home directory"),
    (r">\s*/dev/sd[a-z]", "Direct writes to disk devices"),
    
    # System modification
    (r"sudo\s+rm\s+.*-rf?", "Sudo recursive deletion"),
    (r"chmod\s+777\s+/", "Overly permissive root permissions"),
    (r"chown\s+.*:\s*/", "Ownership changes to root directory"),
    
    # Network and system access
    (r"nc\s+.*-e", "Netcat with command execution"),
    (r"curl\s+.*\|\s*sh", "Downloading and executing scripts"),
    (r"wget\s+.*\|\s*sh", "Downloading and executing scripts"),
    (r"bash\s+<\(curl", "Bash execution from remote scripts"),
    
    # System formatting and partitioning
    (r"fdisk\s+/dev/", "Disk partitioning operations"),
    (r"mkfs\.", "Filesystem creation"),
    (r"dd\s+.*of=/dev/", "Direct disk writes"),
    
    # Process manipulation
    (r"kill\s+-9\s+1", "Killing init process"),
    (r"killall\s+-9", "Forceful termination of all processes"),
    
    # System configuration
    (r"echo\s+.*>\s*/etc/", "Writing to system configuration"),
    (r">\s*/etc/passwd", "Modifying user accounts"),
    (r">\s*/etc/shadow", "Modifying password file"),
]

# Performance anti-patterns to warn about
PERFORMANCE_WARNINGS = [
    (r"find\s+.*-name", "Consider using 'rg --files -g pattern' for better performance"),
    (r"grep\s+(?!.*\|)", "Consider using 'rg' (ripgrep) for faster searching"),
    (r"cat\s+.*\|\s*grep", "Consider using 'rg pattern file' instead of 'cat file | grep pattern'"),
    (r"ls\s+.*\|\s*grep", "Consider using shell globbing or 'rg --files' instead"),
]

# Best practice suggestions
BEST_PRACTICE_SUGGESTIONS = [
    (r"sudo\s+(?!apt|yum|brew)", "Consider if sudo is really necessary for this operation"),
    (r"chmod\s+\d{3,4}", "Consider using symbolic permissions (e.g., 'chmod u+x') for clarity"),
    (r"git\s+push\s+.*--force", "Consider using '--force-with-lease' instead of '--force' for safer pushing"),
]

def load_config() -> Dict[str, Any]:
    """Load Claude Code Buddy configuration for custom command rules."""
    config_paths = [
        ".claude-buddy/config.json",
        os.path.expanduser("~/.claude-buddy/config.json"),
        ".claude/buddy-config.json", 
        os.path.expanduser("~/.claude/buddy-config.json")
    ]
    
    for config_path in config_paths:
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                continue
    
    return {
        "command_validation": {
            "enabled": True,
            "block_dangerous": True,
            "warn_performance": True,
            "suggest_best_practices": True,
            "additional_dangerous_patterns": [],
            "whitelist_patterns": [],
            "strict_mode": False
        }
    }

def check_dangerous_commands(command: str, config: Dict[str, Any]) -> Tuple[bool, str]:
    """Check if command contains dangerous patterns."""
    validation_config = config.get("command_validation", {})
    
    if not validation_config.get("block_dangerous", True):
        return False, ""
    
    # Check whitelist first
    whitelist_patterns = validation_config.get("whitelist_patterns", [])
    for pattern in whitelist_patterns:
        if re.search(pattern, command, re.IGNORECASE):
            return False, ""  # Whitelisted command
    
    # Combine default and additional dangerous patterns
    dangerous_patterns = DANGEROUS_COMMANDS.copy()
    additional_patterns = validation_config.get("additional_dangerous_patterns", [])
    for pattern in additional_patterns:
        dangerous_patterns.append((pattern, "Custom dangerous pattern"))
    
    # Check each dangerous pattern
    for pattern, description in dangerous_patterns:
        if re.search(pattern, command, re.IGNORECASE):
            return True, description
    
    return False, ""

def check_performance_issues(command: str, config: Dict[str, Any]) -> List[str]:
    """Check for performance anti-patterns and return suggestions."""
    validation_config = config.get("command_validation", {})
    
    if not validation_config.get("warn_performance", True):
        return []
    
    suggestions = []
    for pattern, suggestion in PERFORMANCE_WARNINGS:
        if re.search(pattern, command, re.IGNORECASE):
            suggestions.append(suggestion)
    
    return suggestions

def check_best_practices(command: str, config: Dict[str, Any]) -> List[str]:
    """Check for best practice violations and return suggestions."""
    validation_config = config.get("command_validation", {})
    
    if not validation_config.get("suggest_best_practices", True):
        return []
    
    suggestions = []
    for pattern, suggestion in BEST_PRACTICE_SUGGESTIONS:
        if re.search(pattern, command, re.IGNORECASE):
            suggestions.append(suggestion)
    
    return suggestions

def get_safer_alternative(command: str) -> str:
    """Suggest safer alternatives for dangerous commands."""
    command_lower = command.lower()
    
    if "rm -rf" in command_lower:
        return "Consider using 'trash' command or move files to a backup location first"
    elif "chmod 777" in command_lower:
        return "Use more specific permissions like 'chmod u+rwx,g+r,o+r' instead"
    elif "curl" in command_lower and "|" in command_lower and "sh" in command_lower:
        return "Download the script first, review it, then execute: wget script.sh && cat script.sh && bash script.sh"
    elif "sudo" in command_lower and "rm" in command_lower:
        return "Double-check the path and consider using a non-destructive approach first"
    else:
        return "Review the command carefully and consider if there's a safer approach"

def create_block_response(command: str, reason: str, alternative: str) -> Dict[str, Any]:
    """Create a JSON response to block the command execution."""
    return {
        "decision": "block",
        "reason": f"""🚫 Dangerous Command Blocked: '{command}'

⚠️ Risk: {reason}

🛡️ Claude Code Buddy blocked this command to protect your system from potential damage.

💡 Safer approach: {alternative}

If you're certain this command is safe:
1. Run it directly in your terminal
2. Add to whitelist in .claude-buddy/config.json  
3. Use /buddy-config to adjust validation settings

Stay safe! 🔒""",
        "continue": False,
        "suppressOutput": False
    }

def create_warning_response(command: str, warnings: List[str], suggestions: List[str]) -> Dict[str, Any]:
    """Create a JSON response with warnings but allow execution."""
    message_parts = [f"⚠️ Command Analysis: '{command}'"]
    
    if warnings:
        message_parts.append("\n🐌 Performance Suggestions:")
        for warning in warnings:
            message_parts.append(f"  • {warning}")
    
    if suggestions:
        message_parts.append("\n💡 Best Practice Suggestions:")
        for suggestion in suggestions:
            message_parts.append(f"  • {suggestion}")
    
    message_parts.append("\nCommand will proceed, but consider the suggestions above.")
    
    return {
        "decision": "approve",
        "reason": "\n".join(message_parts),
        "continue": True,
        "suppressOutput": False
    }

def create_approve_response() -> Dict[str, Any]:
    """Create a JSON response to approve the command execution."""
    return {
        "decision": "approve",
        "continue": True,
        "suppressOutput": True
    }

def log_command_event(command: str, action: str, blocked: bool, warnings: List[str]):
    """Log command validation events for audit trail."""
    log_dir = ".claude-buddy"
    if not os.path.exists(log_dir):
        try:
            os.makedirs(log_dir)
        except OSError:
            return
    
    log_file = os.path.join(log_dir, "commands.log")
    
    import datetime
    timestamp = datetime.datetime.now().isoformat()
    
    log_entry = {
        "timestamp": timestamp,
        "command": command,
        "action": action,
        "blocked": blocked,
        "warnings": warnings,
        "tool": "command-validator"
    }
    
    try:
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except IOError:
        pass

def main():
    """Main hook execution function."""
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Extract tool information
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})
    
    # Only process Bash tool
    if tool_name != "Bash":
        print(json.dumps(create_approve_response()))
        sys.exit(0)
    
    # Get command being executed
    command = tool_input.get("command", "")
    
    if not command.strip():
        print(json.dumps(create_approve_response()))
        sys.exit(0)
    
    # Load configuration
    config = load_config()
    
    # Check if command validation is enabled
    if not config.get("command_validation", {}).get("enabled", True):
        print(json.dumps(create_approve_response()))
        sys.exit(0)
    
    # Check for dangerous commands
    is_dangerous, danger_reason = check_dangerous_commands(command, config)
    
    if is_dangerous:
        alternative = get_safer_alternative(command)
        log_command_event(command, "blocked", True, [danger_reason])
        
        response = create_block_response(command, danger_reason, alternative)
        print(json.dumps(response))
        sys.exit(2)  # Exit code 2 indicates blocking
    
    # Check for performance issues and best practice violations
    performance_warnings = check_performance_issues(command, config)
    best_practice_suggestions = check_best_practices(command, config)
    
    all_warnings = performance_warnings + best_practice_suggestions
    
    if all_warnings:
        log_command_event(command, "warned", False, all_warnings)
        response = create_warning_response(command, performance_warnings, best_practice_suggestions)
        print(json.dumps(response))
        sys.exit(0)
    
    # Command is safe, log and approve
    log_command_event(command, "approved", False, [])
    print(json.dumps(create_approve_response()))
    sys.exit(0)

if __name__ == "__main__":
    main()