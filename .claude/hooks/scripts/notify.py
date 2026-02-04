#!/usr/bin/env python3
"""
Cross-Platform Notification System for Claude Code
Supports Windows, macOS, and Linux with native notification APIs
"""

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


def main():
    """Main entry point for the notification script"""
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
