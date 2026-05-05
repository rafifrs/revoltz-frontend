export function handleAPIError(error) {
  if (error.response) {
    const { status, data } = error.response;
    const detail = data?.detail || data?.message || 'An error occurred.';
    switch (status) {
      case 400: return `Invalid input: ${detail}`;
      case 401: return 'Session expired. Please log in again.';
      case 403: return 'You do not have permission for this action.';
      case 404: return 'Resource not found.';
      case 422: return `Validation error: ${detail}`;
      case 429: return 'Too many requests. Please wait a moment and try again.';
      case 500: return 'Server error. Please try again later.';
      default:  return detail;
    }
  }
  if (error.request) {
    return 'No response from server. Check that the service is running.';
  }
  return error.message || 'Unknown error occurred.';
}

export default handleAPIError;
