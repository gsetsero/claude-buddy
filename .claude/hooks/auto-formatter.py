#!/usr/bin/env python3
"""
Claude Buddy - Auto-Formatter Hook

This PostToolUse hook automatically formats code files after they are written or modified.
Supports multiple languages and tools for consistent code formatting.
"""

import sys
import json
import os
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional

# Supported formatters by file extension
FORMATTERS = {
    ".py": {
        "tools": ["black", "autopep8", "yapf"],
        "primary": "black",
        "command": "black",
        "args": ["--line-length", "88", "--quiet"]
    },
    ".js": {
        "tools": ["prettier", "eslint"],
        "primary": "prettier",
        "command": "prettier",
        "args": ["--write", "--single-quote", "--trailing-comma", "es5"]
    },
    ".ts": {
        "tools": ["prettier", "eslint"],
        "primary": "prettier", 
        "command": "prettier",
        "args": ["--write", "--single-quote", "--trailing-comma", "es5", "--parser", "typescript"]
    },
    ".tsx": {
        "tools": ["prettier", "eslint"],
        "primary": "prettier",
        "command": "prettier",
        "args": ["--write", "--single-quote", "--trailing-comma", "es5", "--parser", "typescript"]
    },
    ".jsx": {
        "tools": ["prettier", "eslint"],
        "primary": "prettier",
        "command": "prettier",
        "args": ["--write", "--single-quote", "--trailing-comma", "es5", "--parser", "babel"]
    },
    ".json": {
        "tools": ["prettier", "jq"],
        "primary": "prettier",
        "command": "prettier",
        "args": ["--write", "--parser", "json"]
    },
    ".css": {
        "tools": ["prettier", "stylelint"],
        "primary": "prettier",
        "command": "prettier",
        "args": ["--write", "--parser", "css"]
    },
    ".scss": {
        "tools": ["prettier", "stylelint"],
        "primary": "prettier",
        "command": "prettier",
        "args": ["--write", "--parser", "scss"]
    },
    ".html": {
        "tools": ["prettier", "htmlhint"],
        "primary": "prettier",
        "command": "prettier", 
        "args": ["--write", "--parser", "html"]
    },
    ".md": {
        "tools": ["prettier", "markdownlint"],
        "primary": "prettier",
        "command": "prettier",
        "args": ["--write", "--parser", "markdown", "--prose-wrap", "preserve"]
    },
    ".go": {
        "tools": ["gofmt", "goimports"],
        "primary": "gofmt",
        "command": "gofmt",
        "args": ["-w"]
    },
    ".rs": {
        "tools": ["rustfmt"],
        "primary": "rustfmt",
        "command": "rustfmt",
        "args": []
    },
    ".java": {
        "tools": ["google-java-format"],
        "primary": "google-java-format",
        "command": "google-java-format",
        "args": ["--replace"]
    }
}

def load_config() -> Dict[str, Any]:
    """Load Claude Buddy configuration for auto-formatting settings."""
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
        "auto_formatting": {
            "enabled": True,
            "extensions": [".py", ".js", ".ts", ".tsx", ".jsx", ".json", ".css", ".scss", ".md"],
            "tools": {},
            "exclude_patterns": ["node_modules/", ".git/", "dist/", "build/", "__pycache__/"],
            "create_backup": False
        }
    }

def should_format_file(file_path: str, config: Dict[str, Any]) -> bool:
    """Check if file should be formatted based on extension and config."""
    formatting_config = config.get("auto_formatting", {})
    
    if not formatting_config.get("enabled", True):
        return False
    
    # Check if file extension is enabled for formatting
    file_ext = Path(file_path).suffix.lower()
    enabled_extensions = formatting_config.get("extensions", [])
    
    if file_ext not in enabled_extensions:
        return False
    
    # Check exclude patterns
    exclude_patterns = formatting_config.get("exclude_patterns", [])
    for pattern in exclude_patterns:
        if pattern in file_path:
            return False
    
    return True

def find_formatter(file_ext: str, config: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Find available formatter for the given file extension."""
    if file_ext not in FORMATTERS:
        return None
    
    formatter_config = FORMATTERS[file_ext].copy()
    
    # Check for custom tool configuration
    custom_tools = config.get("auto_formatting", {}).get("tools", {})
    if file_ext in custom_tools:
        formatter_config.update(custom_tools[file_ext])
    
    # Check if primary tool is available
    primary_tool = formatter_config["primary"]
    if is_tool_available(primary_tool):
        formatter_config["command"] = primary_tool
        return formatter_config
    
    # Try alternative tools
    for tool in formatter_config["tools"]:
        if is_tool_available(tool):
            formatter_config["command"] = tool
            # Adjust args for different tools if needed
            if tool != formatter_config["primary"]:
                formatter_config["args"] = get_tool_args(tool, file_ext)
            return formatter_config
    
    return None

def is_tool_available(tool_name: str) -> bool:
    """Check if formatting tool is available in PATH."""
    try:
        subprocess.run([tool_name, "--version"], 
                      capture_output=True, 
                      check=False, 
                      timeout=5)
        return True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

def get_tool_args(tool_name: str, file_ext: str) -> List[str]:
    """Get appropriate arguments for different formatting tools."""
    tool_args = {
        "black": ["--line-length", "88", "--quiet"],
        "autopep8": ["--in-place", "--aggressive"],
        "yapf": ["--in-place"],
        "prettier": ["--write"],
        "eslint": ["--fix"],
        "gofmt": ["-w"],
        "rustfmt": [],
        "google-java-format": ["--replace"]
    }
    
    return tool_args.get(tool_name, [])

def create_backup(file_path: str):
    """Create backup of file before formatting."""
    backup_path = f"{file_path}.backup"
    try:
        import shutil
        shutil.copy2(file_path, backup_path)
    except IOError:
        pass  # Backup failed, continue anyway

def format_file(file_path: str, formatter_config: Dict[str, Any]) -> Dict[str, Any]:
    """Format file using the specified formatter."""
    command = formatter_config["command"]
    args = formatter_config["args"]
    
    try:
        # Build full command
        full_command = [command] + args + [file_path]
        
        # Run formatter
        result = subprocess.run(
            full_command,
            capture_output=True,
            text=True,
            timeout=30,
            cwd=os.path.dirname(file_path) or "."
        )
        
        if result.returncode == 0:
            return {
                "success": True,
                "tool": command,
                "message": f"✨ Formatted with {command}",
                "stdout": result.stdout,
                "stderr": result.stderr
            }
        else:
            return {
                "success": False,
                "tool": command,
                "message": f"❌ Formatting failed with {command}",
                "stdout": result.stdout,
                "stderr": result.stderr,
                "return_code": result.returncode
            }
    
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "tool": command,
            "message": f"⏱️ Formatting timeout with {command}",
            "error": "Tool execution timed out"
        }
    except FileNotFoundError:
        return {
            "success": False,
            "tool": command,
            "message": f"🔍 Tool not found: {command}",
            "error": f"Formatter '{command}' not available in PATH"
        }
    except Exception as e:
        return {
            "success": False,
            "tool": command,
            "message": f"💥 Unexpected error with {command}",
            "error": str(e)
        }

def create_response(success: bool, message: str) -> Dict[str, Any]:
    """Create JSON response for the hook."""
    return {
        "continue": True,
        "suppressOutput": not success,  # Show output only if there was an issue
        "message": message if not success else ""
    }

def log_formatting_event(file_path: str, result: Dict[str, Any]):
    """Log formatting events for audit trail."""
    log_dir = ".claude-buddy"
    if not os.path.exists(log_dir):
        try:
            os.makedirs(log_dir)
        except OSError:
            return
    
    log_file = os.path.join(log_dir, "formatting.log")
    
    import datetime
    timestamp = datetime.datetime.now().isoformat()
    
    log_entry = {
        "timestamp": timestamp,
        "file_path": file_path,
        "tool": result.get("tool", "unknown"),
        "success": result.get("success", False),
        "message": result.get("message", ""),
        "hook": "auto-formatter"
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
    tool_response = input_data.get("tool_response", {})
    
    # Only process successful Write, Edit, and MultiEdit operations
    if tool_name not in ["Write", "Edit", "MultiEdit"]:
        print(json.dumps(create_response(True, "")))
        sys.exit(0)
    
    # Check if tool execution was successful
    if not tool_response.get("success", False):
        print(json.dumps(create_response(True, "")))
        sys.exit(0)
    
    # Get file path
    file_path = tool_input.get("file_path", "")
    
    if not file_path or not os.path.exists(file_path):
        print(json.dumps(create_response(True, "")))
        sys.exit(0)
    
    # Load configuration
    config = load_config()
    
    # Check if file should be formatted
    if not should_format_file(file_path, config):
        print(json.dumps(create_response(True, "")))
        sys.exit(0)
    
    # Get file extension and find formatter
    file_ext = Path(file_path).suffix.lower()
    formatter_config = find_formatter(file_ext, config)
    
    if not formatter_config:
        # No formatter available for this file type
        message = f"No formatter available for {file_ext} files"
        print(json.dumps(create_response(True, message)))
        sys.exit(0)
    
    # Create backup if enabled
    if config.get("auto_formatting", {}).get("create_backup", False):
        create_backup(file_path)
    
    # Format the file
    result = format_file(file_path, formatter_config)
    
    # Log the formatting event
    log_formatting_event(file_path, result)
    
    # Create response
    response = create_response(result["success"], result["message"])
    print(json.dumps(response))
    
    sys.exit(0)

if __name__ == "__main__":
    main()