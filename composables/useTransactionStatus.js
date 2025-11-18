export const useTransactionStatus = () => {
  const statusGroups = {
    INITIATED: ['pending', 'incoming_initiated', 'outgoing_initiated', 'reversal_initiated', 'reversal_retry_initiated', 'outgoing_retry_created', 'token_created'],
    COMPLETED: ['completed', 'success', 'reversal_completed', 'reversal_succeeded', 'outgoing_completed'],
    FAILURE: ['failed', 'reversal_failed', 'incoming_failed', 'outgoing_failed', 'token_expired'],
    PROCESSING: ['partially_funded', 'incoming_completed', 'low_balance', 'uncollected_token', 'outgoing_retry_failed', 'reversal_retry_failed', 'reversing'],
  }

  const getStatusGroup = (status) => {
    if (!status) return null

    for (const [group, statuses] of Object.entries(statusGroups)) {
      if (statuses.includes(status)) {
        return group.toLowerCase()
      }
    }

    return null
  }

  return {
    getStatusGroup,
    statusGroups,
  }
}
