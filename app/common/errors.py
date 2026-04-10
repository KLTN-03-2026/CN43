"""Centralized error messages and utilities for consistent API responses."""

from enum import Enum


class ErrorCode(str, Enum):
    """Standard error codes for API responses."""

    # Authentication & Authorization (4xx)
    AUTH_INVALID_TOKEN = "AUTH_INVALID_TOKEN"
    AUTH_USER_NOT_FOUND = "AUTH_USER_NOT_FOUND"
    AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS"
    AUTH_ACCOUNT_NOT_VERIFIED = "AUTH_ACCOUNT_NOT_VERIFIED"
    AUTH_INSUFFICIENT_PERMISSIONS = "AUTH_INSUFFICIENT_PERMISSIONS"

    # Validation (4xx)
    VALIDATION_DUPLICATE_EMAIL = "VALIDATION_DUPLICATE_EMAIL"
    VALIDATION_INVALID_OTP = "VALIDATION_INVALID_OTP"
    VALIDATION_EXPIRED_OTP = "VALIDATION_EXPIRED_OTP"
    VALIDATION_NO_OTP = "VALIDATION_NO_OTP"

    # Jobs (4xx)
    JOB_NOT_FOUND = "JOB_NOT_FOUND"
    JOB_NOT_OWNED = "JOB_NOT_OWNED"

    # Applications (4xx)
    APPLICATION_NOT_FOUND = "APPLICATION_NOT_FOUND"
    APPLICATION_NOT_OWNED = "APPLICATION_NOT_OWNED"
    APPLICATION_JOB_NOT_FOUND = "APPLICATION_JOB_NOT_FOUND"
    APPLICATION_ALREADY_APPLIED = "APPLICATION_ALREADY_APPLIED"
    APPLICATION_NO_CV = "APPLICATION_NO_CV"

    # File Upload (4xx)
    FILE_MISSING_NAME = "FILE_MISSING_NAME"
    FILE_INVALID_TYPE = "FILE_INVALID_TYPE"
    FILE_TOO_LARGE = "FILE_TOO_LARGE"
    FILE_PARSE_ERROR = "FILE_PARSE_ERROR"


class ErrorMessages:
    """Centralized error messages in Vietnamese."""

    AUTH = {
        ErrorCode.AUTH_INVALID_TOKEN: "Token không hợp lệ",
        ErrorCode.AUTH_USER_NOT_FOUND: "Người dùng không tồn tại",
        ErrorCode.AUTH_INVALID_CREDENTIALS: "Sai email hoặc mật khẩu",
        ErrorCode.AUTH_ACCOUNT_NOT_VERIFIED: "Tài khoản chưa xác minh OTP email",
        ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS: "Không đủ quyền để thực hiện hành động này",
    }

    VALIDATION = {
        ErrorCode.VALIDATION_DUPLICATE_EMAIL: "Email đã được đăng ký",
        ErrorCode.VALIDATION_INVALID_OTP: "Mã OTP không đúng",
        ErrorCode.VALIDATION_EXPIRED_OTP: "Mã OTP đã hết hạn",
        ErrorCode.VALIDATION_NO_OTP: "Tài khoản chưa có OTP hợp lệ",
    }

    JOB = {
        ErrorCode.JOB_NOT_FOUND: "Không tìm thấy tin tuyển dụng",
        ErrorCode.JOB_NOT_OWNED: "Tin tuyển dụng không tồn tại hoặc không thuộc về bạn",
    }

    APPLICATION = {
        ErrorCode.APPLICATION_NOT_FOUND: "Không tìm thấy hồ sơ ứng tuyển",
        ErrorCode.APPLICATION_NOT_OWNED: "Hồ sơ này không thuộc về bạn",
        ErrorCode.APPLICATION_JOB_NOT_FOUND: "Tin tuyển dụng không tồn tại hoặc đã đóng",
        ErrorCode.APPLICATION_ALREADY_APPLIED: "Bạn đã ứng tuyển tin này rồi",
        ErrorCode.APPLICATION_NO_CV: "Chưa có nội dung CV (vui lòng nhập text hoặc upload PDF)",
    }

    FILE = {
        ErrorCode.FILE_MISSING_NAME: "File không có tên",
        ErrorCode.FILE_INVALID_TYPE: "Chỉ chấp nhận file PDF",
        ErrorCode.FILE_TOO_LARGE: "File quá lớn (tối đa {max_mb}MB)",
        ErrorCode.FILE_PARSE_ERROR: "Không đọc được nội dung PDF: {error}",
    }

    @classmethod
    def get(cls, code: ErrorCode, **format_args) -> str:
        """Get error message by code with optional formatting.

        Args:
            code: ErrorCode to look up
            **format_args: Format arguments for message template

        Returns:
            Error message in Vietnamese
        """
        # Search through all class dicts
        for attr_name in dir(cls):
            attr = getattr(cls, attr_name)
            if isinstance(attr, dict) and code in attr:
                msg = attr[code]
                return msg.format(**format_args) if format_args else msg

        return "Có lỗi xảy ra"


def get_error_detail(code: ErrorCode, **format_args) -> str:
    """Convenience function to get error message."""
    return ErrorMessages.get(code, **format_args)
