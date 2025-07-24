#!/usr/bin/env python3
"""
Claude Code Buddy - Persona Integration Hook

This UserPromptSubmit hook detects buddy commands and enhances them with
persona-specific context and guidance from the persona system.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple


def load_config() -> Dict[str, Any]:
    """Load Claude Code Buddy configuration."""
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
        "personas": {
            "enabled": True,
            "auto_activation": True,
            "confidence_threshold": 0.7
        }
    }


def load_personas() -> List[Dict[str, Any]]:
    """Load persona definitions from JSON files."""
    personas = []
    persona_dirs = [
        "claude-code-buddy/src/personas",
        ".claude/personas",
        os.path.expanduser("~/.claude/personas")
    ]
    
    for persona_dir in persona_dirs:
        if os.path.exists(persona_dir):
            for file_path in Path(persona_dir).glob("*.json"):
                try:
                    with open(file_path, 'r') as f:
                        persona_data = json.load(f)
                        if isinstance(persona_data, list):
                            personas.extend(persona_data)
                        else:
                            personas.append(persona_data)
                except (json.JSONDecodeError, IOError):
                    continue
    
    return personas


def detect_buddy_command(prompt: str) -> Tuple[bool, Optional[str], str]:
    """
    Detect if the prompt contains a buddy command.
    
    Returns:
        tuple: (is_buddy_command, command_type, cleaned_prompt)
    """
    buddy_pattern = r'/buddy:(\w+)'
    match = re.search(buddy_pattern, prompt)
    
    if match:
        command_type = match.group(1)
        return True, command_type, prompt
    
    return False, None, prompt


def extract_persona_flags(prompt: str) -> List[str]:
    """Extract persona flags from the prompt."""
    persona_flags = []
    
    # Look for --persona-X flags
    persona_pattern = r'--persona-(\w+)'
    matches = re.findall(persona_pattern, prompt)
    persona_flags.extend(matches)
    
    return persona_flags


def calculate_persona_relevance(persona: Dict[str, Any], command_type: str, prompt: str) -> float:
    """Calculate how relevant a persona is to the given command and prompt."""
    relevance_score = 0.0
    
    # Check command type mapping
    command_mapping = persona.get('commands', {})
    if command_type in command_mapping:
        relevance_score += 0.8
    
    # Check keywords in prompt
    keywords = persona.get('keywords', [])
    prompt_lower = prompt.lower()
    
    for keyword in keywords:
        if keyword.lower() in prompt_lower:
            relevance_score += 0.3
    
    # Check domain relevance
    domains = persona.get('domains', [])
    for domain in domains:
        if domain.lower() in prompt_lower:
            relevance_score += 0.2
    
    # Cap at 1.0
    return min(relevance_score, 1.0)


def select_active_personas(personas: List[Dict[str, Any]], command_type: str, prompt: str, persona_flags: List[str], confidence_threshold: float) -> List[Dict[str, Any]]:
    """Select which personas should be active for this request."""
    active_personas = []
    
    # Handle explicit persona flags first
    for flag in persona_flags:
        for persona in personas:
            persona_id = persona.get('id', '').lower()
            persona_name = persona.get('name', '').lower()
            
            if flag.lower() in [persona_id, persona_name]:
                active_personas.append({
                    **persona,
                    'confidence': 1.0,
                    'activation_reason': f'explicitly_requested_via_flag'
                })
                break
    
    # Auto-select personas based on relevance
    for persona in personas:
        if persona in active_personas:
            continue  # Already selected via flag
            
        relevance = calculate_persona_relevance(persona, command_type, prompt)
        
        if relevance >= confidence_threshold:
            active_personas.append({
                **persona,
                'confidence': relevance,
                'activation_reason': 'auto_detected'
            })
    
    return active_personas


def generate_persona_context(active_personas: List[Dict[str, Any]], command_type: str) -> str:
    """Generate context string from active personas."""
    if not active_personas:
        return ""
    
    context_parts = []
    
    # Add header
    context_parts.append("🎭 **Persona Context Active**")
    context_parts.append("")
    
    for persona in active_personas:
        name = persona.get('name', 'Unknown')
        description = persona.get('description', '')
        confidence = persona.get('confidence', 0)
        
        context_parts.append(f"**{name}** (confidence: {confidence:.1f})")
        if description:
            context_parts.append(f"Role: {description}")
        
        # Add command-specific guidance
        commands = persona.get('commands', {})
        if command_type in commands:
            guidance = commands[command_type]
            if isinstance(guidance, dict):
                approach = guidance.get('approach', '')
                focus = guidance.get('focus', [])
                if approach:
                    context_parts.append(f"Approach: {approach}")
                if focus:
                    context_parts.append(f"Focus areas: {', '.join(focus)}")
            elif isinstance(guidance, str):
                context_parts.append(f"Guidance: {guidance}")
        
        context_parts.append("")
    
    # Add collaboration note if multiple personas
    if len(active_personas) > 1:
        context_parts.append("💡 **Collaboration Mode**: Multiple personas are active. Consider their different perspectives and expertise areas.")
        context_parts.append("")
    
    return "\n".join(context_parts)


def enhance_prompt(prompt: str, command_type: str, active_personas: List[Dict[str, Any]]) -> str:
    """Enhance the original prompt with persona context."""
    if not active_personas:
        return prompt
    
    # Generate context
    persona_context = generate_persona_context(active_personas, command_type)
    
    # Build enhanced prompt
    enhanced_parts = [
        persona_context,
        "---",
        "",
        prompt
    ]
    
    return "\n".join(enhanced_parts)


def create_response(enhanced_prompt: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
    """Create JSON response for the hook."""
    response = {
        "prompt": enhanced_prompt
    }
    
    if metadata:
        response["metadata"] = metadata
    
    return response


def log_persona_event(command_type: str, active_personas: List[Dict[str, Any]], original_prompt: str):
    """Log persona activation events for analysis."""
    log_dir = ".claude-buddy"
    if not os.path.exists(log_dir):
        try:
            os.makedirs(log_dir)
        except OSError:
            return
    
    log_file = os.path.join(log_dir, "persona-activation.log")
    
    import datetime
    timestamp = datetime.datetime.now().isoformat()
    
    log_entry = {
        "timestamp": timestamp,
        "command_type": command_type,
        "active_personas": [
            {
                "name": p.get('name', ''),
                "confidence": p.get('confidence', 0),
                "activation_reason": p.get('activation_reason', '')
            }
            for p in active_personas
        ],
        "prompt_length": len(original_prompt),
        "hook": "persona-integration"
    }
    
    try:
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except IOError:
        pass


def main():
    """Main hook execution function."""
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        # Return original prompt on error
        print(json.dumps({"prompt": ""}))
        sys.exit(0)
    
    prompt = input_data.get('prompt', '')
    context = input_data.get('context', {})
    
    # Check if this is a buddy command
    is_buddy, command_type, cleaned_prompt = detect_buddy_command(prompt)
    
    if not is_buddy:
        # Not a buddy command, pass through unchanged
        print(json.dumps({"prompt": prompt}))
        sys.exit(0)
    
    # Load configuration
    config = load_config()
    
    # Check if personas are enabled
    if not config.get("personas", {}).get("enabled", True):
        print(json.dumps({"prompt": prompt}))
        sys.exit(0)
    
    # Load personas
    personas = load_personas()
    
    if not personas:
        # No personas available, pass through unchanged
        print(json.dumps({"prompt": prompt}))
        sys.exit(0)
    
    # Extract persona flags from prompt
    persona_flags = extract_persona_flags(prompt)
    
    # Get confidence threshold
    confidence_threshold = config.get("personas", {}).get("confidence_threshold", 0.7)
    
    # Select active personas
    active_personas = select_active_personas(
        personas, command_type, prompt, persona_flags, confidence_threshold
    )
    
    # Log detection for debugging
    print(f"Detected buddy command: {command_type}, active personas: {len(active_personas)}", file=sys.stderr)
    
    # Log persona activation
    log_persona_event(command_type, active_personas, prompt)
    
    # Enhance prompt with persona context
    enhanced_prompt = enhance_prompt(prompt, command_type, active_personas)
    
    # Create metadata
    metadata = {
        "personas": [
            {
                "name": p.get('name', ''),
                "role": p.get('description', ''),
                "confidence": p.get('confidence', 0)
            }
            for p in active_personas
        ],
        "command": command_type,
        "enhanced": len(active_personas) > 0
    }
    
    # Output the result
    response = create_response(enhanced_prompt, metadata)
    print(json.dumps(response))


if __name__ == "__main__":
    main()