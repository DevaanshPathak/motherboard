"""Custom exceptions for the provisioning module."""

class ProvisioningError(Exception):
    """Base exception for all provisioning errors."""
    pass


class DiscordAPIError(ProvisioningError):
    """Raised when a Discord API request fails."""

    def __init__(self, status_code: int, message: str, retry_after: float | None = None):
        self.status_code = status_code
        self.message = message
        self.retry_after = retry_after
        super().__init__(f"Discord API error {status_code}: {message}" + (f" (retry after {retry_after}s)" if retry_after else ""))


class SyncAbortedError(ProvisioningError):
    """Raised when a synchronization run is aborted due to configuration or structural errors."""
    pass
