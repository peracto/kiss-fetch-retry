interface FetchRetryOptions {
    maxRetries?: number,
    waitPeriods?: number[],
    shouldRetry?: (response: Response, retryIndex: number) => boolean,
    waitTimeout?: (period: number, input: Request|string, response: Response,retryIndex: number) => number,
    fetch?: typeof fetch,
}

const defaultWaitPeriods = [1000, 3000, 5000, 9000]
const defaultMaxRetries = 3
const defaultShouldRetry = (response: Response) => {
    const status = response.status
    return (
        (status >= 100 && status <= 199) ||
        (status >= 429 && status <= 429) ||
        (status >= 500 && status <= 599)
    )
}

const delay = (timeout:number) => new Promise(resolve => setTimeout(resolve, timeout))
const getWait = (waitPeriods:number[], retry:number) => waitPeriods[retry >= waitPeriods.length ? waitPeriods.length - 1 : retry]
const defaultWaitTimeout = (value:number) => value


export function fetchRetryFactory (options: FetchRetryOptions = {}) {
    const maxRetries = options.maxRetries || defaultMaxRetries
    const waitPeriods = options.waitPeriods || defaultWaitPeriods
    const shouldRetry = options.shouldRetry || defaultShouldRetry
    const getWaitTimeout = options.waitTimeout || defaultWaitTimeout
    const _fetch = options.fetch || fetch

    return async function retryFetch(input: Request | string, init?: RequestInit): Promise<Response> {
        for (let retry = 0; ; retry++) {
            const response = await _fetch(input, init)
            if (response.ok || retry >= maxRetries || !shouldRetry(response, retry)) {
                return response
            }
            await delay(getWaitTimeout(
                getWait(waitPeriods, retry),
                input,
                response,
                retry
            ))
        }
    }
}

