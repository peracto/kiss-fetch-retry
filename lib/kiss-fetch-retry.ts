interface FetchRetryOptions {
    maxRetries?: number,
    waitPeriods?: number[],
    shouldRetry?: (response: Response, retryIndex: number) => boolean,
    getWaitTimeout: (period: number, input: Request|string, response: Response,retryIndex: number) => number,
    fetch?: typeof fetch,
}
const _waitPeriods = [1000, 3000, 5000, 9000]
const _maxRetries = 3

const waiter = (timeout:number) => new Promise(resolve => setTimeout(resolve, timeout))
const getWait = (waitPeriods:number[], retry:number) => waitPeriods[retry >= waitPeriods.length ? waitPeriods.length - 1 : retry]
const _getWaitTimeout = (value:number) => value

export default function fetchRetryFactory (options: FetchRetryOptions) {
    const maxRetries = (options && options.maxRetries) || _maxRetries
    const waitPeriods = (options && options.waitPeriods) || _waitPeriods
    const shouldRetry = (options && options.shouldRetry) || _shouldRetryRequest
    const _fetch = (options && options.fetch) || fetch
    const getWaitTimeout = (options && options.getWaitTimeout) || _getWaitTimeout

    return async function retryFetch (input: Request | string, init?: RequestInit): Promise<Response> {
        for (let retry = 0; ; retry++) {
            const response = await _fetch(input, init)
            if (response.ok || retry >= maxRetries || !shouldRetry(response, retry)) { return response }
            await waiter(
                getWaitTimeout(getWait(waitPeriods, retry),
                    input,
                    response,
                    retry
                ))
        }
    }
}

function _shouldRetryRequest (response: Response) {
    const status = response.status
    return (
        (status >= 100 && status <= 199) ||
        (status >= 429 && status <= 429) ||
        (status >= 500 && status <= 599)
    )
}
