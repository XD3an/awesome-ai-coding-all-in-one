#!/usr/bin/env python3
"""
Cross-Platform Notification System for Claude Code
Supports Windows, macOS, and Linux with native notification APIs

Usage:
  1. With stdin JSON (for hooks):
     echo '{"hook_event_name":"Stop","tool_name":"Write"}' | python notify.py

  2. With arguments (legacy):
     python notify.py <type> <message>
"""

import json
import os
import platform
import sys
from pathlib import Path


def get_icon_path():
    """Get the absolute path to the notification icon"""
    script_dir = Path(__file__).parent
    icon_path = script_dir / "icon" / "claude-ai-icon.ico"

    if icon_path.exists():
        return str(icon_path)

    # Fallback: try PNG format
    icon_path_png = script_dir / "icon" / "claude-ai-icon.png"
    if icon_path_png.exists():
        return str(icon_path_png)

    return None


# Import Windows notification library at module level with error handling
_win10toast_available = False
_toast_notifier = None

try:
    from win10toast import ToastNotifier
    _toast_notifier = ToastNotifier()
    _win10toast_available = True
except ImportError:
    pass
except Exception as e:
    # win10toast has a known bug that throws TypeError on import
    # If notification still works, we can ignore this
    error_str = str(e)
    if "WPARAM" in error_str or "LRESULT" in error_str or "WNDPROC" in error_str:
        try:
            from win10toast import ToastNotifier
            _toast_notifier = ToastNotifier()
            _win10toast_available = True
        except:
            pass
    else:
        print(f"[WARNING] win10toast import issue: {e}")


def notify_windows(title, message, icon_path):
    """Display notification on Windows using win10toast"""
    if not _win10toast_available or _toast_notifier is None:
        print("[ERROR] win10toast not installed. Install with: pip install win10toast")
        return False

    try:
        # Display notification (duration in seconds)
        # Note: threaded=False to avoid TypeError with WPARAM
        _toast_notifier.show_toast(
            title=title,
            msg=message,
            icon_path=icon_path,
            duration=5,  # seconds
            threaded=False
        )
        return True
    except Exception as e:
        # win10toast has a known bug that throws TypeError even when notification succeeds
        # If the error message contains specific patterns, consider it a success
        error_str = str(e)
        if "WPARAM" in error_str or "LRESULT" in error_str or "WNDPROC" in error_str:
            print(f"[WARNING] Ignoring known win10toast bug: {e}")
            return True
        print(f"[ERROR] Windows notification failed: {e}")
        return False


def notify_macos(title, message, icon_path):
    """Display notification on macOS using pync"""
    try:
        import pync

        # Display notification
        pync.notify(
            message=message,
            title=title,
            contentImage=icon_path if icon_path else None,
            sound="default"
        )
        return True
    except ImportError:
        print("[ERROR] pync not installed. Install with: pip install pync")
        return False
    except Exception as e:
        print(f"[ERROR] macOS notification failed: {e}")
        return False


def notify_linux(title, message, icon_path):
    """Display notification on Linux using notify2"""
    try:
        import notify2

        # Initialize notification system
        notify2.init("Claude Code")

        # Create notification
        notification = notify2.Notification(
            title,
            message,
            icon_path if icon_path else "dialog-information"
        )

        # Set timeout (milliseconds, -1 for default)
        notification.set_timeout(5000)

        # Display notification
        notification.show()
        return True
    except ImportError:
        print("[ERROR] notify2 not installed. Install with: pip install notify2")
        return False
    except Exception as e:
        print(f"[ERROR] Linux notification failed: {e}")
        return False


def show_notification(notification_type, message):
    """
    Main notification function that dispatches to platform-specific implementations

    Args:
        notification_type: Type of notification (e.g., "stop", "permission", "error")
        message: The notification message text
    """
    # Map notification types to titles
    title_map = {
        "stop": "Claude Code - Session Ending",
        "permission": "Claude Code - Permission Required",
        "error": "Claude Code - Error",
        "warning": "Claude Code - Warning",
        "info": "Claude Code - Information"
    }

    title = title_map.get(notification_type, "Claude Code")
    icon_path = get_icon_path()

    # Detect platform and call appropriate notification function
    system = platform.system()

    print(f"[INFO] Platform: {system}")
    print(f"[INFO] Title: {title}")
    print(f"[INFO] Message: {message}")
    print(f"[INFO] Icon: {icon_path if icon_path else 'System default'}")

    success = False

    if system == "Windows":
        success = notify_windows(title, message, icon_path)
    elif system == "Darwin":  # macOS
        success = notify_macos(title, message, icon_path)
    elif system == "Linux":
        success = notify_linux(title, message, icon_path)
    else:
        print(f"[ERROR] Unsupported platform: {system}")
        return False

    if success:
        print("[SUCCESS] Notification displayed")
    else:
        print("[FAILED] Notification could not be displayed")

    return success


def parse_stdin_json():
    """Parse JSON input from stdin (sent by Claude Code hooks)"""
    try:
        if sys.stdin.isatty():
            return None
        raw = sys.stdin.read()
        if not raw.strip():
            return None
        return json.loads(raw)
    except json.JSONDecodeError:
        return None
    except Exception:
        return None


def generate_message_from_hook(data):
    """
    Generate notification message based on hook event data

    Returns:
        tuple: (notification_type, title, message)
    """
    event_name = data.get("hook_event_name", "")
    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input", {})
    tool_response = data.get("tool_response", {})
    error = data.get("error", "")

    # SessionStart
    if event_name == "SessionStart":
        source = data.get("source", "startup")
        return ("info", "Session Started", f"Session {source}")

    # Stop
    if event_name == "Stop":
        return ("info", "Task Complete", "Claude has finished responding")

    # PreToolUse
    if event_name == "PreToolUse":
        if tool_name in ("Write", "Edit"):
            file_path = tool_input.get("file_path", "unknown")
            filename = Path(file_path).name if file_path else "unknown"
            return ("info", f"Writing: {filename}", f"Modifying {filename}")
        if tool_name == "Bash":
            cmd = tool_input.get("command", "")
            short_cmd = cmd[:50] + "..." if len(cmd) > 50 else cmd
            return ("info", "Running Command", short_cmd)
        if tool_name == "Task":
            desc = tool_input.get("description", "subtask")
            return ("info", "Spawning Task", desc[:60])
        return ("info", f"Tool: {tool_name}", f"Using {tool_name}")

    # PostToolUse
    if event_name == "PostToolUse":
        if tool_name in ("Write", "Edit"):
            file_path = tool_input.get("file_path", "")
            filename = Path(file_path).name if file_path else "file"
            success = tool_response.get("success", True)
            status = "saved" if success else "failed"
            return ("info", f"File {status}", filename)
        if tool_name == "Task":
            return ("info", "Subtask Done", "A subtask has completed")
        return ("info", f"{tool_name} Done", f"{tool_name} completed")

    # PostToolUseFailure
    if event_name == "PostToolUseFailure":
        short_err = error[:80] if error else "Unknown error"
        return ("error", f"{tool_name} Failed", short_err)

    # Notification
    if event_name == "Notification":
        ntype = data.get("notification_type", "info")
        msg = data.get("message", "Notification")
        return (ntype, "Claude Code", msg[:100])

    # SubagentStart / SubagentStop
    if event_name == "SubagentStart":
        agent_type = data.get("agent_type", "Agent")
        return ("info", "Agent Started", f"{agent_type} spawned")
    if event_name == "SubagentStop":
        agent_type = data.get("agent_type", "Agent")
        return ("info", "Agent Stopped", f"{agent_type} finished")

    # SessionEnd
    if event_name == "SessionEnd":
        reason = data.get("reason", "ended")
        return ("info", "Session Ended", f"Reason: {reason}")

    # Default fallback
    return ("info", "Claude Code", event_name or "Hook triggered")


def main():
    """Main entry point for the notification script"""
    # Check for stdin JSON first (hook mode)
    hook_data = parse_stdin_json()

    if hook_data:
        # Hook mode: generate message from JSON
        ntype, title, message = generate_message_from_hook(hook_data)
        success = show_notification(ntype, message)
        if success:
            print("Notification sent successfully")
        else:
            print("Notification failed")
        sys.exit(0 if success else 1)

    # Legacy mode: command line arguments
    if len(sys.argv) < 3:
        print("Usage: python notify.py <notification_type> <message>")
        print("\nNotification types:")
        print("  stop        - Session ending notification")
        print("  permission  - Permission required notification")
        print("  error       - Error notification")
        print("  warning     - Warning notification")
        print("  info        - Information notification")
        print("\nExample:")
        print('  python notify.py stop "Session has ended"')
        print('  python notify.py permission "Please review permissions"')
        sys.exit(1)

    notification_type = sys.argv[1]
    message = sys.argv[2]

    success = show_notification(notification_type, message)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
