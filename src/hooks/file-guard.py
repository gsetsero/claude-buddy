#!/usr/bin/env python3
"""
Claude Buddy - File Protection Hook

This PreToolUse hook protects sensitive files from being written to or modified.
It blocks operations on files that contain secrets, credentials, or other sensitive data.
"""

import sys
import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any

# Sensitive file patterns that should be protected
SENSITIVE_FILE_PATTERNS = [
    # Environment and secrets
    r"\.env.*",
    r".*\.key$",
    r".*\.pem$", 
    r".*\.p12$",
    r".*\.pfx$",
    r"secrets?\..*",
    r"credentials?\..*",
    r".*secret.*",
    r".*credential.*",
    
    # SSH and crypto
    r"id_rsa.*",
    r"id_ed25519.*",
    r"known_hosts",
    r"authorized_keys",
    
    # Database
    r".*\.sqlite.*",
    r".*\.db$",
    
    # Configuration that might contain secrets
    r"\.aws/.*",
    r"\.ssh/.*",
    r"\.docker/config\.json",
    
    # Common secret file names
    r"api[-_]?keys?\..*",
    r"tokens?\..*",
    r"passwords?\..*",
]

# Critical system directories/files to protect
CRITICAL_PATHS = [
    "/etc/passwd",
    "/etc/shadow", 
    "/etc/sudoers",
    "/boot/",
    "/sys/",
    "/proc/",
]

def load_config() -> Dict[str, Any]:
    """Load Claude Buddy configuration for custom protection rules."""
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
        "file_protection": {
            "enabled": True,
            "additional_patterns": [],
            "whitelist_patterns": [],
            "strict_mode": False
        }
    }

def is_sensitive_file(file_path: str, config: Dict[str, Any]) -> bool:
    """Check if a file path matches sensitive file patterns."""
    # Normalize path
    file_path = os.path.normpath(file_path)
    file_name = os.path.basename(file_path)
    
    # Check against critical system paths
    for critical_path in CRITICAL_PATHS:
        if file_path.startswith(critical_path):
            return True
    
    # Get protection config
    protection_config = config.get("file_protection", {})
    
    # Check whitelist first (if file is whitelisted, allow it)
    whitelist_patterns = protection_config.get("whitelist_patterns", [])
    for pattern in whitelist_patterns:
        if re.match(pattern, file_path, re.IGNORECASE):
            return False
    
    # Check default sensitive patterns
    all_patterns = SENSITIVE_FILE_PATTERNS.copy()
    
    # Add additional patterns from config
    additional_patterns = protection_config.get("additional_patterns", [])
    all_patterns.extend(additional_patterns)
    
    # Check each pattern
    for pattern in all_patterns:
        if re.match(pattern, file_name, re.IGNORECASE) or re.match(pattern, file_path, re.IGNORECASE):
            return True
    
    return False

def get_file_context(file_path: str) -> str:
    """Get additional context about why this file is protected."""
    file_path_lower = file_path.lower()
    
    if ".env" in file_path_lower:
        return "Environment files often contain API keys, database credentials, and other secrets."
    elif any(ext in file_path_lower for ext in [".key", ".pem", ".p12", ".pfx"]):
        return "Cryptographic key files contain sensitive security credentials."
    elif "secret" in file_path_lower or "credential" in file_path_lower:
        return "Files with 'secret' or 'credential' in the name typically contain sensitive data."
    elif any(name in file_path_lower for name in ["id_rsa", "id_ed25519"]):
        return "SSH private keys provide authentication access and should be protected."
    elif ".sqlite" in file_path_lower or file_path_lower.endswith(".db"):
        return "Database files may contain sensitive user data and should be handled carefully."
    else:
        return "This file matches patterns for sensitive data and is protected by Claude Buddy."

def create_block_response(file_path: str, reason: str) -> Dict[str, Any]:
    """Create a JSON response to block the tool execution."""
    return {
        "decision": "block",
        "reason": reason,
        "continue": False,
        "suppressOutput": False
    }

def create_approve_response() -> Dict[str, Any]:
    """Create a JSON response to approve the tool execution."""
    return {
        "decision": "approve", 
        "continue": True,
        "suppressOutput": True
    }

def log_protection_event(file_path: str, action: str, blocked: bool):
    """Log protection events for audit trail."""
    log_dir = ".claude-buddy"
    if not os.path.exists(log_dir):
        try:
            os.makedirs(log_dir)
        except OSError:
            return  # Can't create log directory, skip logging
    
    log_file = os.path.join(log_dir, "protection.log")
    
    import datetime
    timestamp = datetime.datetime.now().isoformat()
    
    log_entry = {
        "timestamp": timestamp,
        "file_path": file_path,
        "action": action,
        "blocked": blocked,
        "tool": "file-guard"
    }
    
    try:
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except IOError:
        pass  # Logging failed, but don't block the operation

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
    
    # Only process Write, Edit, and MultiEdit tools
    if tool_name not in ["Write", "Edit", "MultiEdit"]:
        # Not a file write operation, allow it
        print(json.dumps(create_approve_response()))
        sys.exit(0)
    
    # Get file path being written to
    file_path = tool_input.get("file_path", "")
    
    if not file_path:
        # No file path specified, allow it
        print(json.dumps(create_approve_response()))
        sys.exit(0)
    
    # Load configuration
    config = load_config()
    
    # Check if file protection is enabled
    if not config.get("file_protection", {}).get("enabled", True):
        print(json.dumps(create_approve_response()))
        sys.exit(0)
    
    # Check if this is a sensitive file
    if is_sensitive_file(file_path, config):
        file_context = get_file_context(file_path)
        
        reason = f"""🛡️ File Protection: Access to '{file_path}' has been blocked.

{file_context}

Claude Buddy protects sensitive files to prevent accidental exposure of:
• API keys and secrets
• Database credentials  
• SSH private keys
• Authentication tokens
• Personal data

To modify this file:
1. Use your text editor directly
2. Add to whitelist in .claude-buddy/config.json
3. Disable protection temporarily with /buddy-config

Stay secure! 🔒"""

        # Log the protection event
        log_protection_event(file_path, tool_name, True)
        
        # Block the operation
        response = create_block_response(file_path, reason)
        print(json.dumps(response))
        sys.exit(2)  # Exit code 2 indicates blocking
    
    # File is safe to write, log and approve
    log_protection_event(file_path, tool_name, False)
    print(json.dumps(create_approve_response()))
    sys.exit(0)

if __name__ == "__main__":
    main()